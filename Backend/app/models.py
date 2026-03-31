from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    scores = relationship("UserScore", back_populates="user")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(Text, nullable=True)

    lessons = relationship("Lesson", back_populates="course")
    questions = relationship("Question", back_populates="course")
    scores = relationship("UserScore", back_populates="course")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
    order = Column(Integer, default=0)

    course = relationship("Course", back_populates="lessons")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    question = Column(Text, nullable=False)
    option_a = Column(String(255), nullable=False)
    option_b = Column(String(255), nullable=False)
    option_c = Column(String(255), nullable=False)
    option_d = Column(String(255), nullable=False)
    correct_answer = Column(String(10), nullable=False) # e.g. "a", "b", "c", "d"
    explanation = Column(Text, nullable=True)

    course = relationship("Course", back_populates="questions")

class UserScore(Base):
    __tablename__ = "user_scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    time_taken = Column(Integer, default=0, nullable=False) # store time in seconds
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="scores")
    course = relationship("Course", back_populates="scores")
