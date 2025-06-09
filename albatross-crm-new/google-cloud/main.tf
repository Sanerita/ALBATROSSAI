terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

resource "google_vertex_ai_endpoint" "lead_scoring" {
  name         = "lead-scoring-endpoint"
  display_name = "Lead Scoring Model"
  location     = "us-central1"
  
  deployed_model {
    model = google_vertex_ai_model.lead_scoring_model.resource_name
    
    dedicated_resources {
      machine_spec {
        machine_type = "n1-standard-4"
      }
      min_replica_count = 1
      max_replica_count = 3
    }
  }
}

resource "google_pubsub_topic" "agent_events" {
  name = "crm-agent-updates"
}

resource "google_dialogflow_cx_agent" "engagement_bot" {
  display_name     = "Albatross Engagement Bot"
  default_language = "en"
  time_zone        = "America/New_York"
  location         = "global"
}