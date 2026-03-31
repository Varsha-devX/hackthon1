from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app import models, auth

def seed_data():
    db = SessionLocal()
    
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Add Courses
    courses_data = [
        {"name": "HTML", "description": "The language for building web pages"},
        {"name": "CSS", "description": "The language for styling web pages"},
        {"name": "JavaScript", "description": "The language for programming web pages"},
        {"name": "Python", "description": "A versatile and popular programming language"},
        {"name": "SQL", "description": "The language for querying databases"},
    ]

    for c in courses_data:
        existing = db.query(models.Course).filter(models.Course.name == c["name"]).first()
        if existing:
            existing.description = c["description"]
        else:
            db.add(models.Course(**c))
    
    db.commit()

    # Get course IDs
    html_id = db.query(models.Course).filter(models.Course.name == "HTML").first().id
    css_id = db.query(models.Course).filter(models.Course.name == "CSS").first().id
    js_id = db.query(models.Course).filter(models.Course.name == "JavaScript").first().id
    python_id = db.query(models.Course).filter(models.Course.name == "Python").first().id
    sql_id = db.query(models.Course).filter(models.Course.name == "SQL").first().id

    # Add Lessons
    lessons_data = [
        {"course_id": html_id, "title": "HTML Introduction", "content": "# What is HTML?\nHTML stands for HyperText Markup Language. It is the standard markup language for creating web pages.", "order": 1},
        {"course_id": html_id, "title": "HTML Elements", "content": "# HTML Elements\nAn HTML element is defined by a start tag, some content, and an end tag.", "order": 2},
        {"course_id": css_id, "title": "CSS Introduction", "content": "# What is CSS?\nCSS stands for Cascading Style Sheets. It describes how HTML elements are to be displayed on screen.", "order": 1},
        {"course_id": js_id, "title": "JS Variables", "content": "# JavaScript Variables\nVariables are containers for storing data values.", "order": 1},
        {"course_id": python_id, "title": "Python Syntax", "content": "# Python Syntax\nPython syntax can be executed by writing directly in the Command Line.", "order": 1},
        {"course_id": sql_id, "title": "SQL SELECT", "content": "# SQL SELECT Statement\nThe SELECT statement is used to select data from a database.", "order": 1},
    ]

    for l in lessons_data:
        if not db.query(models.Lesson).filter(models.Lesson.title == l["title"]).first():
            db.add(models.Lesson(**l))

    # Add Questions (Quizzes) - 5 per language
    questions_data = [
        # HTML Questions (5)
        {
            "course_id": html_id,
            "question": "What does HTML stand for?",
            "option_a": "Hyper Text Markup Language",
            "option_b": "Hyperlinks and Text Markup Language",
            "option_c": "Home Tool Markup Language",
            "option_d": "Hyper Tool Markup Language",
            "correct_answer": "a",
            "explanation": "HTML stands for Hyper Text Markup Language."
        },
        {
            "course_id": html_id,
            "question": "Which HTML element is used for the largest heading?",
            "option_a": "<head>",
            "option_b": "<h6>",
            "option_c": "<h1>",
            "option_d": "<heading>",
            "correct_answer": "c",
            "explanation": "<h1> is the largest heading tag."
        },
        {
            "course_id": html_id,
            "question": "Which HTML attribute specifies an alternate text for an image?",
            "option_a": "title",
            "option_b": "alt",
            "option_c": "src",
            "option_d": "longdesc",
            "correct_answer": "b",
            "explanation": "The alt attribute provides alternative text for an image."
        },
        {
            "course_id": html_id,
            "question": "Which element is used to create an unordered list?",
            "option_a": "<ol>",
            "option_b": "<list>",
            "option_c": "<ul>",
            "option_d": "<dl>",
            "correct_answer": "c",
            "explanation": "<ul> creates an unordered (bulleted) list."
        },
        {
            "course_id": html_id,
            "question": "What is the correct HTML element for inserting a line break?",
            "option_a": "<break>",
            "option_b": "<lb>",
            "option_c": "<br>",
            "option_d": "<newline>",
            "correct_answer": "c",
            "explanation": "<br> inserts a single line break."
        },
        # CSS Questions (5)
        {
            "course_id": css_id,
            "question": "What does CSS stand for?",
            "option_a": "Computer Style Sheets",
            "option_b": "Cascading Style Sheets",
            "option_c": "Colorful Style Sheets",
            "option_d": "Creative Style Sheets",
            "correct_answer": "b",
            "explanation": "CSS stands for Cascading Style Sheets."
        },
        {
            "course_id": css_id,
            "question": "Which property is used to change the background color?",
            "option_a": "bgcolor",
            "option_b": "color",
            "option_c": "background-color",
            "option_d": "background",
            "correct_answer": "c",
            "explanation": "The background-color property sets the background color of an element."
        },
        {
            "course_id": css_id,
            "question": "Which CSS property controls the text size?",
            "option_a": "font-style",
            "option_b": "text-size",
            "option_c": "font-size",
            "option_d": "text-style",
            "correct_answer": "c",
            "explanation": "font-size is used to control the size of text."
        },
        {
            "course_id": css_id,
            "question": "How do you select an element with id 'demo'?",
            "option_a": ".demo",
            "option_b": "*demo",
            "option_c": "#demo",
            "option_d": "demo",
            "correct_answer": "c",
            "explanation": "The # symbol is used to select elements by their id."
        },
        {
            "course_id": css_id,
            "question": "Which property is used to change the font of an element?",
            "option_a": "font-style",
            "option_b": "font-weight",
            "option_c": "font-family",
            "option_d": "font-variant",
            "correct_answer": "c",
            "explanation": "font-family specifies the font for an element."
        },
        # JavaScript Questions (5)
        {
            "course_id": js_id,
            "question": "Inside which HTML element do we put the JavaScript?",
            "option_a": "<js>",
            "option_b": "<scripting>",
            "option_c": "<javascript>",
            "option_d": "<script>",
            "correct_answer": "d",
            "explanation": "The <script> tag is used to embed JavaScript."
        },
        {
            "course_id": js_id,
            "question": "How do you write 'Hello World' in an alert box?",
            "option_a": "alertBox('Hello World');",
            "option_b": "msgBox('Hello World');",
            "option_c": "alert('Hello World');",
            "option_d": "msg('Hello World');",
            "correct_answer": "c",
            "explanation": "The alert() function displays an alert box."
        },
        {
            "course_id": js_id,
            "question": "How do you create a function in JavaScript?",
            "option_a": "function myFunction()",
            "option_b": "function:myFunction()",
            "option_c": "function = myFunction()",
            "option_d": "create myFunction()",
            "correct_answer": "a",
            "explanation": "The correct syntax is function myFunction()."
        },
        {
            "course_id": js_id,
            "question": "How do you call a function named 'myFunction'?",
            "option_a": "call myFunction()",
            "option_b": "call function myFunction()",
            "option_c": "myFunction()",
            "option_d": "execute myFunction()",
            "correct_answer": "c",
            "explanation": "You call a function by writing its name followed by parentheses."
        },
        {
            "course_id": js_id,
            "question": "Which operator is used to assign a value to a variable?",
            "option_a": "*",
            "option_b": "-",
            "option_c": "=",
            "option_d": "x",
            "correct_answer": "c",
            "explanation": "The = operator assigns a value to a variable."
        },
        # Python Questions (5)
        {
            "course_id": python_id,
            "question": "Which keyword is used to create a function in Python?",
            "option_a": "function",
            "option_b": "def",
            "option_c": "create",
            "option_d": "lambda",
            "correct_answer": "b",
            "explanation": "In Python, 'def' is used to define functions."
        },
        {
            "course_id": python_id,
            "question": "Which method is used to add an element to a list?",
            "option_a": "add()",
            "option_b": "push()",
            "option_c": "append()",
            "option_d": "insert()",
            "correct_answer": "c",
            "explanation": "The append() method adds an element to the end of a list."
        },
        {
            "course_id": python_id,
            "question": "What is the output of print(2 ** 3)?",
            "option_a": "6",
            "option_b": "8",
            "option_c": "9",
            "option_d": "5",
            "correct_answer": "b",
            "explanation": "** is the exponentiation operator. 2^3 = 8."
        },
        {
            "course_id": python_id,
            "question": "Which of these is NOT a valid Python data type?",
            "option_a": "int",
            "option_b": "float",
            "option_c": "char",
            "option_d": "str",
            "correct_answer": "c",
            "explanation": "Python does not have a 'char' data type. It uses 'str' for characters."
        },
        {
            "course_id": python_id,
            "question": "How do you start a comment in Python?",
            "option_a": "//",
            "option_b": "/*",
            "option_c": "#",
            "option_d": "<!--",
            "correct_answer": "c",
            "explanation": "In Python, comments start with #."
        },
        # SQL Questions (5)
        {
            "course_id": sql_id,
            "question": "What does SQL stand for?",
            "option_a": "Structured Query Language",
            "option_b": "Strong Question Language",
            "option_c": "Structured Question Language",
            "option_d": "Simple Query Language",
            "correct_answer": "a",
            "explanation": "SQL stands for Structured Query Language."
        },
        {
            "course_id": sql_id,
            "question": "Which SQL statement is used to extract data from a database?",
            "option_a": "EXTRACT",
            "option_b": "GET",
            "option_c": "SELECT",
            "option_d": "OPEN",
            "correct_answer": "c",
            "explanation": "The SELECT statement is used to extract data."
        },
        {
            "course_id": sql_id,
            "question": "Which SQL statement is used to update data in a database?",
            "option_a": "MODIFY",
            "option_b": "SAVE",
            "option_c": "UPDATE",
            "option_d": "CHANGE",
            "correct_answer": "c",
            "explanation": "The UPDATE statement is used to modify existing data."
        },
        {
            "course_id": sql_id,
            "question": "Which SQL clause is used to filter records?",
            "option_a": "FILTER",
            "option_b": "WHERE",
            "option_c": "HAVING",
            "option_d": "LIMIT",
            "correct_answer": "b",
            "explanation": "The WHERE clause filters records based on conditions."
        },
        {
            "course_id": sql_id,
            "question": "Which SQL statement is used to delete data from a database?",
            "option_a": "REMOVE",
            "option_b": "COLLAPSE",
            "option_c": "DELETE",
            "option_d": "DROP",
            "correct_answer": "c",
            "explanation": "The DELETE statement removes rows from a table."
        },
    ]

    for q in questions_data:
        if not db.query(models.Question).filter(models.Question.question == q["question"]).first():
            db.add(models.Question(**q))

    db.commit()
    print("Database seeded successfully!")
    db.close()

if __name__ == "__main__":
    seed_data()
