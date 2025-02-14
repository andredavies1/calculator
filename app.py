from flask import Flask, redirect, url_for #Import libraries

app = Flask(__name__)

@app.route("/")
def hello_world(): #Routes URL
    return "<p>Hello, World!</p>"

@app.route("/admin")
def admin():
    return redirect(url_for("home")) #Redirect page when accessing URL/admin

if __name__ == "__main__": #Initiate Flask/ run script.
    app.run(debug=True)
