from flask import Flask, request, render_template
import pickle
import os
from werkzeug.utils import secure_filename
from PIL import Image
import numpy as np

app = Flask(__name__)

# Load the trained model
model_path = r'C:\Users\HARIHARAN K\Desktop\Crop-Quality-prediction-System-Using-CNN\source_code\crop_quality_model.pkl'
with open(model_path, 'rb') as f:
    model = pickle.load(f)

# Set the upload folder
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def upload_form():
    return render_template('upload.html')

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return 'No file part'
    
    file = request.files['file']
    
    if file.filename == '':
        return 'No selected file'
    
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Process the image and make a prediction
        image = Image.open(file_path).convert('RGB')
        image = image.resize((200, 200))  # Resize to match model input
        image_array = np.array(image) / 255.0  # Normalize the image
        image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension

        prediction = model.predict(image_array)
        quality_score = float(prediction[0][0])  # Assuming model outputs probability for "Good"
        label = "Good" if quality_score > 0.4 else "Bad"
        return f'Prediction: {label} | Quality score: {quality_score * 100:.2f}%'

if __name__ == '__main__':
    app.run(debug=True)