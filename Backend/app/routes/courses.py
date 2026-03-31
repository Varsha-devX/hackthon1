from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database

router = APIRouter()

@router.get("/", response_model=List[schemas.Course])
def get_courses(db: Session = Depends(database.get_db)):
    return db.query(models.Course).all()

@router.get("/{course_id}", response_model=schemas.Course)
def get_course(course_id: int, db: Session = Depends(database.get_db)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.get("/{course_id}/lessons", response_model=List[schemas.Lesson])
def get_lessons(course_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.Lesson).filter(models.Lesson.course_id == course_id).order_by(models.Lesson.order).all()
