from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from rembg import remove
import io
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Configure CORS for all routes

@app.route('/remove-background', methods=['POST', 'OPTIONS'])
def handle_remove_background():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
        
    if 'image' not in request.files:
        return "No image file provided", 400

    file = request.files['image']

    if file.filename == '':
        return "No selected file", 400

    try:
        input_bytes = file.read()
        output_bytes = remove(input_bytes)
        
        # Send the processed image back as a file
        response = send_file(
            io.BytesIO(output_bytes),
            mimetype='image/png',
            as_attachment=False, # Send inline instead of as download
            download_name=f"nobg_{file.filename}.png" # Optional, provides a filename if saved
        )
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        print(f"Error processing image: {e}")
        return f"Error processing image: {e}", 500

# Add a simple health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    # Use os.environ.get to allow port configuration via environment variable
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Flask server on port {port}...")
    # Set debug=True for development, allows auto-reloading
    # Set host='0.0.0.0' to make the server accessible on your network
    app.run(host='0.0.0.0', port=port, debug=True) 