# 7-Layer Immersive Learning Pipeline

This modular Python pipeline transforms standard educational content (PDFs) into an immersive, AI-adaptive, and gamified learning ecosystem.

## Architecture

The pipeline consists of 7 functional layers:

1.  **Core Processing**: PDF Validation, OCR, Web Intelligence, Pedagogical Structuring.
2.  **Immersive Content**: Generation of VR Classrooms, AR Assets, and Virtual Tours.
3.  **AI Adaptive Engine**: Personalization of learning paths and AI Tutor configuration.
4.  **Multimedia Generation**: Creation of Video, Audio, and Infographic assets.
5.  **Gamification Engine**: Application of game mechanics, badges, and leaderboards.
6.  **Collaboration & PBL**: Setup of collaborative workspaces and Project-Based Learning challenges.
7.  **Credentialing**: Minting of Blockchain Credentials (NFTs) and final output logging.

## Setup

1.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

2.  Run the pipeline:
    ```bash
    python main.py
    ```

## Database

The pipeline integrates with Supabase. Ensure the migration `supabase/complete_migration_v8_immersive.sql` has been applied to your database.
