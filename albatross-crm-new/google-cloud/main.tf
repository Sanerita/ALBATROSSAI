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

}

resource "google_pubsub_topic" "agent_events" {
  name = "crm-agent-updates"
}

resource "google_dialogflow_cx_agent" "engagement_bot" {
  display_name     = "Albatross Engagement Bot"
  default_language_code = "en"
  time_zone        = "America/New_York"
  location         = "global"
}