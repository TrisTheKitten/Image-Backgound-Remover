# Troubleshooting Guide for Remove BG for FREE

## "Failed to fetch" Error in Console

This error occurs when the frontend can't connect to the backend server. Here's how to fix it:

### Step 1: Make sure the backend is running

1. Close any existing backend windows
2. Run the simplified backend script:
   ```
   run_backend.bat
   ```
3. Look for any error messages in the console

### Step 2: Check Python environment

Ensure you have Python 3.8 or newer:
```
python --version
```

If you have Python installed but the command isn't recognized, make sure it's in your PATH.

### Step 3: Check for port conflicts

The default backend port is 5000. Make sure nothing else is using this port.

To check if port 5000 is in use on Windows:
```
netstat -ano | findstr :5000
```

If the port is in use, you can either:
- Stop the conflicting service
- Change the port in `backend/app.py` (and update the frontend code to match)

### Step 4: Alternative setup with a different port

If port 5000 is consistently causing issues, try:

1. Edit `backend/app.py` and change the port:
   ```python
   port = int(os.environ.get('PORT', 8000))  # Change to 8000 or another available port
   ```

2. Edit `src/app/page.tsx` and update all instances of 'http://localhost:5000' to the new port:
   ```typescript
   const response = await fetch('http://localhost:8000/health');
   // And
   const response = await fetch('http://localhost:8000/remove-background', {
   ```

3. Restart both frontend and backend

### Step 5: Install requirements manually

If you're having persistent issues with package installations:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install --upgrade pip
pip install Flask flask-cors
pip install Pillow
pip install rembg
```

### Step 6: Check browser console for specific errors

Open your browser's developer tools (F12) and look at the Network tab when you try to remove a background.
This can provide more details about what's failing.

### Common issues:

1. **CORS errors**: 
   - Make sure the backend has the CORS headers properly set
   - Try a different browser
   - Disable browser extensions that might block requests

2. **Network issues**:
   - Check firewall settings
   - Try disabling antivirus temporarily

3. **Python or dependency issues**:
   - Use a specific version of rembg: `pip install rembg==2.0.60`
   - Try `pip install --no-cache-dir -r requirements.txt` to bypass cached packages

4. **Backend not responding**:
   - Check if `http://localhost:5000/health` responds in a browser
   - Try restarting your computer to clear any lingering processes

If you continue to have issues, please open an issue on the repository with detailed information about your environment and the error messages you're seeing. 