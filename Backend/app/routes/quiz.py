from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, auth, database

router = APIRouter()

@router.get("/{course_id}", response_model=List[schemas.Question])
def get_quiz_questions(course_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    questions = db.query(models.Question).filter(models.Question.course_id == course_id).all()
    if not questions:
        raise HTTPException(status_code=404, detail="No quiz found for this course")
    return questions

@router.post("/submit", response_model=schemas.QuizResult)
def submit_quiz(submission: schemas.QuizSubmission, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    # Validate course id
    if submission.course_id is None or submission.course_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid course_id")

    # Ensure at least one answer is submitted
    if submission.answers is None or len(submission.answers) == 0:
        raise HTTPException(status_code=400, detail="At least one answer must be provided")

    # Calculate score
    questions = db.query(models.Question).filter(models.Question.course_id == submission.course_id).all()
    if not questions:
        raise HTTPException(status_code=404, detail="Course not found")
    
    total_questions = len(questions)
    correct_count = 0
    
    user_answers = {ans.get("question_id"): ans.get("answer") for ans in submission.answers}
    details = []
    
    for q in questions:
        user_ans = user_answers.get(q.id)
        is_correct = (user_ans == q.correct_answer)
        if is_correct:
            correct_count += 1
            
        details.append({
            "question_id": q.id,
            "question": q.question,
            "option_a": q.option_a,
            "option_b": q.option_b,
            "option_c": q.option_c,
            "option_d": q.option_d,
            "user_answer": user_ans,
            "correct_answer": q.correct_answer,
            "is_correct": is_correct,
            "explanation": q.explanation
        })
            
    # Save score
    user_score = models.UserScore(
        user_id=current_user.id,
        course_id=submission.course_id,
        score=correct_count,
        total_questions=total_questions,
        time_taken=submission.time_taken
    )
    db.add(user_score)
    db.commit()
    db.refresh(user_score)
    
    percentage = (correct_count / total_questions) * 100 if total_questions > 0 else 0
    return {
        "score": correct_count,
        "total_questions": total_questions,
        "percentage": round(percentage, 2),
        "time_taken": submission.time_taken,
        "timestamp": user_score.timestamp,
        "details": details
    }

@router.get("/results", response_model=List[schemas.UserScore])
def get_results(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    results = db.query(models.UserScore).filter(models.UserScore.user_id == current_user.id).order_by(models.UserScore.timestamp.desc()).all()
    
    response_data = []
    for r in results:
        course = db.query(models.Course).filter(models.Course.id == r.course_id).first()
        response_data.append({
            "id": r.id,
            "user_id": r.user_id,
            "score": r.score,
            "total_questions": r.total_questions,
            "percentage": round((r.score / r.total_questions) * 100, 2) if r.total_questions > 0 else 0,
            "time_taken": r.time_taken,
            "timestamp": r.timestamp,
            "course_name": course.name if course else "Unknown"
        })
    return response_data

@router.get("/leaderboard/{course_id}", response_model=List[schemas.LeaderboardEntry])
def get_leaderboard(course_id: int, db: Session = Depends(database.get_db)):
    # Order by score descending, then time_taken ascending (fastest)
    results = db.query(models.UserScore).filter(models.UserScore.course_id == course_id).order_by(
        models.UserScore.score.desc(),
        models.UserScore.time_taken.asc()
    ).limit(10).all()
    
    response_data = []
    for r in results:
        # get user name
        user = db.query(models.User).filter(models.User.id == r.user_id).first()
        if user:
            response_data.append({
                "user_id": r.user_id,
                "name": user.name,
                "score": r.score,
                "total_questions": r.total_questions,
                "percentage": round((r.score / r.total_questions) * 100, 2) if r.total_questions > 0 else 0,
                "time_taken": r.time_taken,
                "timestamp": r.timestamp
            })
    return response_data
