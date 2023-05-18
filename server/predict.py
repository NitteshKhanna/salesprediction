from flask import Flask,request
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_percentage_error, mean_squared_error
import csv

app=Flask(__name__)

@app.route("/predict",methods=['POST'])
def predict():
    json=request.json
    data=json['data']
    title=json['title']
    time=json['days']
    data=list(map(int,data.split(",")))

    
    actual = data.copy()
    X = np.array(data[:-1]).reshape(-1, 1)
    y = np.array(data[1:])
    predicted = []

    
    model = LinearRegression()
    model.fit(X, y)

    for i in range(time):
        
        temp = model.predict([[data[-1]]])[0]
        data.append(temp)
        predicted.append(temp)

    l=len(actual)
    mape = round(mean_absolute_percentage_error(actual, predicted[:l]),3)
    mse = round(mean_squared_error(actual, predicted[:l]),3)
    accuracy = 100 - mape

    with open("actual", 'w') as csvfile: 
        csvwriter = csv.writer(csvfile) 
        csvwriter.writerow(actual)

    with open("predicted", 'w') as csvfile: 
        csvwriter = csv.writer(csvfile) 
        csvwriter.writerow(predicted)

    return {'actual':data,'predicted':predicted,"mape":mape,"mse":mse,"accuracy":accuracy}

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


if(__name__=="__main__"):
    app.run(debug=True)