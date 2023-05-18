from flask import Flask,request
import numpy as np
from sklearn.linear_model import LinearRegression
import csv

app=Flask(__name__)

@app.route("/predict",methods=['POST'])
def predict():
    json=request.json
    data=json['data']
    title=json['title']
    time=json['days']
    data=list(map(int,data.split(",")))

    actual=data.copy()
    X = np.array(data[:-1]).reshape(-1, 1)
    y = np.array(data[1:])
    predicted=[]
    # Create and fit the linear regression model
    model = LinearRegression()
    model.fit(X, y)
    for i in range(time):
    # Predict the upcoming sales
        temp=model.predict([[data[-1]]])[0]
        data.append(temp)
        predicted.append(temp)
    
    with open("actual", 'w') as csvfile: 
        csvwriter = csv.writer(csvfile) 
        csvwriter.writerows(actual)

    with open("predicted", 'w') as csvfile: 
        csvwriter = csv.writer(csvfile) 
        csvwriter.writerows(predicted)

    return {'actual':data,'predicted':predicted}

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


if(__name__=="__main__"):
    app.run(debug=True)