# Crop Quality Prediction System Using CNN

This project is a Flask application that allows users to upload images for crop quality prediction using a trained Convolutional Neural Network (CNN) model. The model is loaded from a pickle file and is used to make predictions based on the uploaded images.

## Project Structure

```
flask-image-upload
├── app.py                # Main application file
├── model
│   └── model.pkl        # Serialized trained model
├── static
│   └── uploads          # Directory for storing uploaded images
├── templates
│   └── upload.html      # HTML form for image upload
├── requirements.txt      # Project dependencies
└── README.md             # Project documentation
```

## Requirements

To run this application, you need to install the required dependencies. You can do this by running:

```
pip install -r requirements.txt
```

## Running the Application

1. Ensure you have Python installed on your machine.
2. Navigate to the project directory.
3. Run the application using the following command:

```
python app.py
```

4. Open your web browser and go to `http://127.0.0.1:5000/upload` to access the image upload form.
5. Choose an image file and click the "Upload" button to submit the image for prediction.

## Usage

After uploading an image, the application will process the image and use the trained model to predict the quality of the crop. The results will be displayed on the web page.

## License

This project is licensed under the MIT License.