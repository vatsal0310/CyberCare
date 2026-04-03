# Save this at: backend/app/seed.py

from guided_workflow.database import SessionLocal
from guided_workflow import models

# Import your two isolated workflow seeds
from guided_workflow.seeds.pentest_seed import seed_pentest
from guided_workflow.seeds.websec_seed import seed_websec

def seed_all():
    db = SessionLocal()
    
    try:
        print("Wiping database for fresh multi-workflow deployment...")
        # Clear out the old data so we don't get duplicates
        db.query(models.GuidedTask).delete()
        db.query(models.GuidedModule).delete()
        db.query(models.GuidedPath).delete()
        db.commit()

        # Run Workflow 1: Pentesting
        print("Executing Pentest Seed...")
        seed_pentest(db)
        
        # Run Workflow 2: Web Security
        print("Executing Web Security Seed...")
        seed_websec(db)

        # Save everything to the database!
        db.commit()
        print("✅ Success! All Guided Workflows loaded successfully.")

    except Exception as e:
        print(f"❌ An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_all()