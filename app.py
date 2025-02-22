from flask import Flask, redirect, url_for, render_template,request,jsonify #Import libraries

app = Flask(__name__)

@app.route("/")
def hello_world(): #Routes URL
    return render_template("index.html")

@app.route("/calculate", methods=['POST'])
def calculate():
    data = request.json #grab data
    equation = data.get("equation") # Extract the equation

    try: 
        result = eval(equation)
        return jsonify({"result": result})
    except:
        return jsonify({"error": "Invalid input"}), 400


if __name__ == "__main__": #Initiate Flask/ run script.
    app.run(debug=True)

