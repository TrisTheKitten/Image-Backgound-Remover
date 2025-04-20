# Remove BG for FREE

A web application for removing backgrounds from images using AI. It consists of a Next.js frontend and a Flask backend.

## Features

- Drag and drop image upload
- AI-powered background removal
- Multiple background color options
- High-resolution image download
- Responsive design

## Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- npm or yarn

## Setup and Installation

### Frontend (Next.js)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Access the frontend at http://localhost:3000

### Backend (Flask)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```bash
   python app.py
   ```

5. The API will be available at http://localhost:5000

## API Endpoints

- **POST /remove-background**: Removes the background from an uploaded image
  - Request: Form data with 'image' field containing the image file
  - Response: PNG image with transparent background

## Usage

1. Open the frontend in a web browser
2. Upload an image by dragging and dropping or clicking on the upload area
3. Click the "Remove Background" button
4. Choose a background color if desired
5. Download the processed image

## Technologies Used

- **Frontend**:
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - Lucide React (icons)

- **Backend**:
  - Flask
  - rembg (background removal)
  - Pillow (image processing)
  - Flask-CORS

## License

MIT

## Troubleshooting

### "Failed to fetch" Error
If you see a "Failed to fetch" error in the browser console:

1. Make sure the backend server is running:
   ```bash
   # Use the simplified script to run the backend
   run_backend.bat
   ```

2. Check if the backend is accessible:
   - Open a browser and navigate to `http://localhost:5000/health`
   - You should see a response like `{"status":"ok"}`

3. If the backend still fails to start:
   - Ensure Python 3.8+ is installed and available in your PATH
   - Try running the commands manually:
     ```bash
     cd backend
     python -m venv venv
     venv\Scripts\activate
     pip install -r requirements.txt
     python app.py
     ```

4. CORS Issues:
   - If you're getting CORS errors, make sure your browser isn't blocking cross-origin requests
   - Try using a different browser or disabling any browser extensions that might block requests

5. Port Conflicts:
   - If port 5000 is already in use, you can change the port in `backend/app.py`
   - Remember to update the frontend code in `src/app/page.tsx` to use the new port
