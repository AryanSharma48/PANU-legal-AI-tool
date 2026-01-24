import sqlite3
import os
import xml.etree.ElementTree as ET
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token

app = Flask(__name__)
# Allow all origins for the demo to prevent CORS errors during the pitch
CORS(app, resources={r"/*": {"origins": "*"}})

# CONFIGURATION
app.config["JWT_SECRET_KEY"] = "startup-weekend-jaipur-demo-key"
jwt = JWTManager(app)

# DATABASE SETUP
DB_NAME = "panu.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY, 
            password TEXT, 
            kyc_verified BOOLEAN,
            full_name TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# --- AUTH ROUTES ---

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    hashed_pw = generate_password_hash(password)
    
    try:
        with sqlite3.connect(DB_NAME) as conn:
            c = conn.cursor()
            c.execute("INSERT INTO users (username, password, kyc_verified) VALUES (?, ?, ?)", 
                      (username, hashed_pw, False))
            conn.commit()
    except sqlite3.IntegrityError:
        return jsonify({"msg": "User already exists"}), 400
        
    return jsonify({"msg": "User created successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    with sqlite3.connect(DB_NAME) as conn:
        c = conn.cursor()
        c.execute("SELECT password FROM users WHERE username = ?", (username,))
        result = c.fetchone()
    
    if not result or not check_password_hash(result[0], password):
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)

# --- KYC ROUTE (DEMO MODE: XML PARSING ONLY) ---

@app.route('/verify-kyc', methods=['POST'])
def verify_kyc():
    # In a real app, we would verify the JWT here. 
    # For the demo, we assume the current user is whoever is presenting.
    current_user = "demo_user" 

    if 'file' not in request.files:
        return jsonify({"msg": "No file uploaded"}), 400
    
    xml_file = request.files['file']
    
    try:
        # 1. Read the XML directly
        xml_content = xml_file.read()
        
        # 2. Parse it to find the Name
        root = ET.fromstring(xml_content)
        
        # Robust search for UidData (handles different XML versions)
        uid_data = root.find('.//UidData') or root.find('UidData')
        
        if uid_data is None:
            # Fallback: If root is UidData itself
            if root.tag.endswith('UidData'):
                uid_data = root

        if uid_data is None:
            print("Debug: Could not find UidData tag")
            return jsonify({"msg": "Invalid XML structure"}), 400

        # Extract Name from <Poi> tag
        poi = uid_data.find('Poi') or uid_data.find('.//Poi')
        name = poi.get('name') if poi is not None else "Verified Citizen"
        
        # 3. Update the Database (So the app remembers they are verified)
        with sqlite3.connect(DB_NAME) as conn:
            c = conn.cursor()
            # We blindly update 'demo_user' or create them if missing
            c.execute("INSERT OR REPLACE INTO users (username, kyc_verified, full_name) VALUES (?, ?, ?)", 
                      (current_user, True, name))
            conn.commit()

        print(f"✅ DEMO SUCCESS: Verified as {name}")
        return jsonify({
            "msg": "KYC Verified Successfully", 
            "name": name,
            "status": "verified"
        }), 200

    except Exception as e:
        print(f"❌ DEMO ERROR: {e}")
        # Even if it fails, for a demo, sometimes you might just want to return success!
        # But let's return the error for debugging.
        return jsonify({"msg": "XML Processing Failed"}), 500

if __name__ == '__main__':
    # Running on port 5000
    app.run(debug=True, port=5000)