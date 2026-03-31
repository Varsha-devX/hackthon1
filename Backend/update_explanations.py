from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models

def update_explanations():
    db = SessionLocal()
    
    html_id = db.query(models.Course).filter(models.Course.name == "HTML").first().id
    css_id = db.query(models.Course).filter(models.Course.name == "CSS").first().id
    js_id = db.query(models.Course).filter(models.Course.name == "JavaScript").first().id
    python_id = db.query(models.Course).filter(models.Course.name == "Python").first().id
    sql_id = db.query(models.Course).filter(models.Course.name == "SQL").first().id

    questions_data = [
        # HTML
        {"course_id": html_id, "question": "What does HTML stand for?", "explanation": "HTML stands for Hyper Text Markup Language."},
        {"course_id": html_id, "question": "Which HTML element is used for the largest heading?", "explanation": "<h1> is the largest heading tag."},
        {"course_id": html_id, "question": "Which HTML attribute specifies an alternate text for an image?", "explanation": "The alt attribute provides alternative text for an image."},
        {"course_id": html_id, "question": "Which element is used to create an unordered list?", "explanation": "<ul> creates an unordered (bulleted) list."},
        {"course_id": html_id, "question": "What is the correct HTML element for inserting a line break?", "explanation": "<br> inserts a single line break."},
        # CSS
        {"course_id": css_id, "question": "What does CSS stand for?", "explanation": "CSS stands for Cascading Style Sheets."},
        {"course_id": css_id, "question": "Which property is used to change the background color?", "explanation": "The background-color property sets the background color of an element."},
        {"course_id": css_id, "question": "Which CSS property controls the text size?", "explanation": "font-size is used to control the size of text."},
        {"course_id": css_id, "question": "How do you select an element with id 'demo'?", "explanation": "The # symbol is used to select elements by their id."},
        {"course_id": css_id, "question": "Which property is used to change the font of an element?", "explanation": "font-family specifies the font for an element."},
        # JS
        {"course_id": js_id, "question": "Inside which HTML element do we put the JavaScript?", "explanation": "The <script> tag is used to embed JavaScript."},
        {"course_id": js_id, "question": "How do you write 'Hello World' in an alert box?", "explanation": "The alert() function displays an alert box."},
        {"course_id": js_id, "question": "How do you create a function in JavaScript?", "explanation": "The correct syntax is function myFunction()."},
        {"course_id": js_id, "question": "How do you call a function named 'myFunction'?", "explanation": "You call a function by writing its name followed by parentheses."},
        {"course_id": js_id, "question": "Which operator is used to assign a value to a variable?", "explanation": "The = operator assigns a value to a variable."},
        # Python
        {"course_id": python_id, "question": "Which keyword is used to create a function in Python?", "explanation": "In Python, 'def' is used to define functions."},
        {"course_id": python_id, "question": "Which method is used to add an element to a list?", "explanation": "The append() method adds an element to the end of a list."},
        {"course_id": python_id, "question": "What is the output of print(2 ** 3)?", "explanation": "** is the exponentiation operator. 2^3 = 8."},
        {"course_id": python_id, "question": "Which of these is NOT a valid Python data type?", "explanation": "Python does not have a 'char' data type. It uses 'str' for characters."},
        {"course_id": python_id, "question": "How do you start a comment in Python?", "explanation": "In Python, comments start with #."},
        # SQL
        {"course_id": sql_id, "question": "What does SQL stand for?", "explanation": "SQL stands for Structured Query Language."},
        {"course_id": sql_id, "question": "Which SQL statement is used to extract data from a database?", "explanation": "The SELECT statement is used to extract data."},
        {"course_id": sql_id, "question": "Which SQL statement is used to update data in a database?", "explanation": "The UPDATE statement is used to modify existing data."},
        {"course_id": sql_id, "question": "Which SQL clause is used to filter records?", "explanation": "The WHERE clause filters records based on conditions."},
        {"course_id": sql_id, "question": "Which SQL statement is used to delete data from a database?", "explanation": "The DELETE statement removes rows from a table."},
    ]

    for q_data in questions_data:
        q = db.query(models.Question).filter(models.Question.question == q_data["question"]).first()
        if q:
            q.explanation = q_data["explanation"]

    db.commit()
    print("Explanations added to database successfully!")
    db.close()

if __name__ == "__main__":
    update_explanations()
