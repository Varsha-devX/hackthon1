from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# Auth Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Course Schemas
class CourseBase(BaseModel):
    name: str
    description: Optional[str] = None

class Course(CourseBase):
    id: int

    class Config:
        from_attributes = True

# Lesson Schemas
class LessonBase(BaseModel):
    title: str
    content: str
    order: int

class Lesson(LessonBase):
    id: int
    course_id: int

    class Config:
        from_attributes = True

# Question Schemas
class QuestionBase(BaseModel):
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str

class Question(QuestionBase):
    id: int
    course_id: int
    # correct_answer is hidden in the list GET call

    class Config:
        from_attributes = True

class QuestionDetail(Question):
    correct_answer: str
    explanation: Optional[str] = None

# Quiz Schemas
class QuizSubmission(BaseModel):
    course_id: int
    answers: List[dict] # [ { "question_id": 1, "answer": "a" }, ... ]
    time_taken: int = 0

class AnswerDetail(BaseModel):
    question_id: int
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    user_answer: Optional[str] = None
    correct_answer: str
    is_correct: bool
    explanation: Optional[str] = None

class QuizResult(BaseModel):
    score: int
    total_questions: int
    percentage: float
    time_taken: int = 0
    timestamp: datetime
    details: Optional[List[AnswerDetail]] = None

# Score Schemas
class UserScore(QuizResult):
    id: int
    user_id: int
    course_name: str

    class Config:
        from_attributes = True

class LeaderboardEntry(BaseModel):
    user_id: int
    name: str
    score: int
    total_questions: int
    percentage: float
    time_taken: int
    timestamp: datetime
