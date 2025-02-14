from flask import Flask, redirect, url_for, render_template #Import libraries

app = Flask(__name__)

@app.route("/")
def hello_world(): #Routes URL
    return render_template("index.html", content= "hello")

if __name__ == "__main__": #Initiate Flask/ run script.
    app.run(debug=True)

