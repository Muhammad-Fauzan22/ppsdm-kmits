"use server";

/**
 * Server Actions for AI-Powered Content Generation
 * Integrates with Unified AI Service for secure API handling
 */

import {
  queryAI,
  generateLearningContent,
  generateQuizQuestions,
  generateCurriculum,
  analyzeAssessment,
  AIModel,
} from "@/lib/ai-service";
import { createClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

/**
 * Generate learning content for a course module
 */
export async function generateModuleContent(
  courseId: string,
  topic: string,
  level: "beginner" | "intermediate" | "advanced"
) {
  try {
    console.log(`[AI] Generating module content for: ${topic}`);

    const content = await generateLearningContent(topic, level);

    // Save to Supabase
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("modules")
      .update({ content })
      .eq("course_id", courseId)
      .select();

    if (error) throw error;

    revalidatePath(`/dashboard/courses/${courseId}`);

    return {
      success: true,
      content,
      modulesUpdated: data?.length || 0,
    };
  } catch (error) {
    console.error("[AI] Module content generation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Generate quiz questions for a module
 */
export async function generateModuleQuiz(
  moduleId: string,
  topic: string,
  questionCount: number = 5
) {
  try {
    console.log(`[AI] Generating ${questionCount} quiz questions for: ${topic}`);

    const questionsJson = await generateQuizQuestions(topic, questionCount);

    // Parse JSON questions
    let questions: any[] = [];
    try {
      // Extract JSON from response if wrapped in text
      const jsonMatch = questionsJson.match(/\[[\s\S]*\]/);
      questions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch (e) {
      console.warn("[AI] Failed to parse quiz JSON, using raw response");
      questions = [{ text: questionsJson, type: "text" }];
    }

    // Save questions to Supabase
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("assessments")
      .insert(
        questions.map((q, idx) => ({
          module_id: moduleId,
          title: `Question ${idx + 1}`,
          content: JSON.stringify(q),
          type: "quiz",
          order: idx,
        }))
      )
      .select();

    if (error) throw error;

    revalidatePath(`/dashboard/courses`);

    return {
      success: true,
      questionsGenerated: data?.length || 0,
      questions,
    };
  } catch (error) {
    console.error("[AI] Quiz generation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Generate full course curriculum
 */
export async function generateCourseCurriculum(
  courseTitle: string,
  duration: string = "4 weeks"
) {
  try {
    console.log(`[AI] Generating curriculum for: ${courseTitle}`);

    const curriculum = await generateCurriculum(courseTitle, duration);

    return {
      success: true,
      curriculum,
    };
  } catch (error) {
    console.error("[AI] Curriculum generation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Analyze student assessment results
 */
export async function analyzeStudentResults(
  studentId: string,
  assessmentType: string,
  responses: Record<string, string>
) {
  try {
    console.log(`[AI] Analyzing assessment for student: ${studentId}`);

    const analysis = await analyzeAssessment(responses, assessmentType);

    // Save analysis to Supabase
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("user_progress")
      .update({ metadata: { ai_analysis: analysis } })
      .eq("user_id", studentId)
      .select();

    if (error) throw error;

    return {
      success: true,
      analysis,
      saved: !!data,
    };
  } catch (error) {
    console.error("[AI] Assessment analysis failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Generate personalized learning recommendations
 */
export async function generateLearningRecommendations(
  studentId: string,
  currentCourses: string[],
  assessmentResults: Record<string, number>
) {
  try {
    console.log(`[AI] Generating recommendations for student: ${studentId}`);

    const prompt = `Based on the student's current courses (${currentCourses.join(", ")}) and assessment results (${JSON.stringify(assessmentResults)}), recommend 3-5 relevant courses and learning paths for continued growth. Consider:
- Strength areas to build upon
- Weakness areas to improve
- Complementary skills to develop
- Career relevance

Provide actionable, specific recommendations.`;

    const result = await queryAI(
      [{ role: "user", content: prompt }],
      AIModel.AUTO,
      1024
    );

    if (!result.success) {
      throw new Error(result.error || "AI query failed");
    }

    return {
      success: true,
      recommendations: result.content,
    };
  } catch (error) {
    console.error("[AI] Recommendation generation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Generate adaptive learning path
 */
export async function generateAdaptiveLearningPath(
  studentLevel: "beginner" | "intermediate" | "advanced",
  goals: string[],
  timeAvailable: string
) {
  try {
    console.log(`[AI] Generating adaptive learning path`);

    const prompt = `Create a personalized adaptive learning path for a ${studentLevel} level student with these goals: ${goals.join(", ")}. 
Available time: ${timeAvailable}.

Include:
- Week-by-week breakdown
- Specific courses/modules to take
- Time allocation
- Milestones and checkpoints
- Flexibility for pacing adjustments

Make it practical and achievable.`;

    const result = await queryAI(
      [{ role: "user", content: prompt }],
      AIModel.AUTO,
      2048
    );

    if (!result.success) {
      throw new Error(result.error || "AI query failed");
    }

    return {
      success: true,
      learningPath: result.content,
      model: result.model,
    };
  } catch (error) {
    console.error("[AI] Learning path generation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Health check for AI services
 */
export async function checkAIServiceHealth() {
  try {
    const result = await queryAI(
      [{ role: "user", content: "Respond with 'OK' only." }],
      AIModel.AUTO,
      10
    );

    return {
      success: result.success,
      model: result.model,
      timestamp: new Date().toISOString(),
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}
