import { notFound } from "next/navigation"
import { ProjectDetails } from "@/components/projects/project-details"
import { getProjectById } from "@/lib/actions/project-actions"

export default async function ProjectPage({ params }: { params: { id: string } }) {
  try {
    // Verify the project exists
    await getProjectById(params.id)

    return <ProjectDetails id={params.id} />
  } catch (error) {
    notFound()
  }
}
