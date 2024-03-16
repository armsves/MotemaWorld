import tensorflow as tf
from tf2onnx import convert
import onnx

model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(30,)),
    
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(128, activation='relu'),  
    tf.keras.layers.Dense(256, activation='relu'),
    
    tf.keras.layers.Dense(512, activation='relu'),
    tf.keras.layers.Dropout(0.3),
    
    tf.keras.layers.Dense(256, activation='relu'),  
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dropout(0.3),
    
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(32, activation='relu'),
    
    tf.keras.layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])

onnx_model, _ = convert.from_keras(model, opset=13)

onnx_file = "geiger_model.onnx"
onnx.save(onnx_model, onnx_file)