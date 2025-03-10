from flask import Flask, render_template, request, send_file
import json

app = Flask(__name__)

scoutingData = []

@app.route("/")
def returnIndexPage():
    return(render_template("index.html"))

def rawDataToCSVString(jsonData):
    ret = ""
    for key in jsonData:
        ret += f"%s,"%(jsonData[key])
    ret = ret[0:len(ret) - 1]
    ret += "\n"
    return ret

def addStringToDatabase(stringData):
    with open("scoutingdata.csv", "a") as file:
        file.write(stringData)

def isNumberArrayValid(numArray):
    print(numArray)
    for num in numArray:
        if not isinstance(num, (int)) or num < 0:
            return False
    return True

def isStringArrayValid(stringArray):
    for stringlol in stringArray:
        if not isinstance(stringlol, (str)) or len(stringlol) <= 0:
            return False
    return True
        
def isBoolArrayValid(boolArray):
    for boolEntry in boolArray:
        if not isinstance(boolEntry, (bool)):
            return False
    return True

def isDataValid(jsonData):
    values = list(jsonData.values())
    header = values[:3]
    scoring = values[3:15]
    endgame = values[15:len(values)]
    
    return isStringArrayValid(header) and isNumberArrayValid(scoring) and isBoolArrayValid(endgame)
    

@app.route("/send", methods=["post"])
def onPost():
    if(isDataValid(request.json)):
        print("Data is valid. Adding")
        addStringToDatabase(rawDataToCSVString(request.json))
        return "success", 200
    print("Data invalid")
    return "rejected", 400

@app.route("/getData", methods=["get"])
def onDataRequest():
    return send_file("scoutingdata.csv")

if __name__ == "__main__":
    app.run()