import os
from google.cloud import aiplatform
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()
aiplatform.init(project=os.getenv("GCP_PROJECT_ID"))

class LeadRequest(BaseModel):
    email: str
    company: str
    interactions: list[dict]

@app.post("/score")
async def score_lead(lead: LeadRequest):
    try:
        endpoint = aiplatform.Endpoint(
            endpoint_name="projects/{}/locations/us-central1/endpoints/lead-scoring".format(
                os.getenv("GCP_PROJECT_ID")
        )
        
        # Prepare Vertex AI prediction request
        instance = {
            "email_domain": lead.email.split("@")[-1],
            "company_size": len(lead.company),
            "interaction_count": len(lead.interactions)
        }
        
        response = endpoint.predict(instances=[instance])
        return {"score": response.predictions[0][0]}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)

    endpoint = aiplatform.Endpoint(
    endpoint_name=f"projects/{os.getenv('GCP_PROJECT')}/locations/us-central1/endpoints/lead-scoring",
    credentials=aiplatform.gapic.Credentials.from_service_account_file(
        os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
)