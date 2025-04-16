import type { User } from "@/contexts/user-context"

// Helper function to create a base email template
function createBaseTemplate(content: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OpsFlow Notification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          border-bottom: 1px solid #e9ecef;
        }
        .content {
          padding: 20px;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6c757d;
          border-top: 1px solid #e9ecef;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Project Management</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Project Management Tool. All rights reserved.</p>
          <p>This is an automated message, please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// New team member template
export function getNewTeamMemberTemplate(member: any, addedBy: User) {
  const content = `
    <h2>New Team Member Added</h2>
    <p>A new team member has been added to your organization:</p>
    <ul>
      <li><strong>Name:</strong> ${member.name}</li>
      <li><strong>Email:</strong> ${member.email}</li>
      <li><strong>Role:</strong> ${member.role}</li>
      <li><strong>Department:</strong> ${member.department || "Not specified"}</li>
      <li><strong>Status:</strong> ${member.status}</li>
    </ul>
    <p>Added by: ${addedBy.name}</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-app-url.com"}/team" class="button">View Team</a>
  `
  return createBaseTemplate(content)
}

// Task assigned template
export function getTaskAssignedTemplate(task: any, assignee: any, assignedBy: User, projectName: string) {
  const content = `
    <h2>Task Assigned to You</h2>
    <p>You have been assigned a new task:</p>
    <ul>
      <li><strong>Task:</strong> ${task.title}</li>
      <li><strong>Project:</strong> ${projectName}</li>
      <li><strong>Due Date:</strong> ${task.due_date ? new Date(task.due_date).toLocaleDateString() : "Not specified"}</li>
      <li><strong>Priority:</strong> ${task.priority || "Not specified"}</li>
      <li><strong>Status:</strong> ${task.status}</li>
    </ul>
    <p>Description: ${task.description || "No description provided"}</p>
    <p>Assigned by: ${assignedBy.name}</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-app-url.com"}/tasks/${task.id}" class="button">View Task</a>
  `
  return createBaseTemplate(content)
}

// Task status update template
export function getTaskStatusUpdateTemplate(task: any, updatedBy: User, projectName: string, oldStatus: string) {
  const content = `
    <h2>Task Status Updated</h2>
    <p>A task status has been updated:</p>
    <ul>
      <li><strong>Task:</strong> ${task.title}</li>
      <li><strong>Project:</strong> ${projectName}</li>
      <li><strong>Old Status:</strong> ${oldStatus}</li>
      <li><strong>New Status:</strong> ${task.status}</li>
      <li><strong>Due Date:</strong> ${task.due_date ? new Date(task.due_date).toLocaleDateString() : "Not specified"}</li>
    </ul>
    <p>Updated by: ${updatedBy.name}</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-app-url.com"}/tasks/${task.id}" class="button">View Task</a>
  `
  return createBaseTemplate(content)
}

// New project template
export function getNewProjectTemplate(project: any, createdBy: User) {
  const content = `
    <h2>New Project Created</h2>
    <p>A new project has been created:</p>
    <ul>
      <li><strong>Project Name:</strong> ${project.name}</li>
      <li><strong>Description:</strong> ${project.description || "No description provided"}</li>
      <li><strong>Start Date:</strong> ${project.start_date ? new Date(project.start_date).toLocaleDateString() : "Not specified"}</li>
      <li><strong>End Date:</strong> ${project.end_date ? new Date(project.end_date).toLocaleDateString() : "Not specified"}</li>
      <li><strong>Status:</strong> ${project.status}</li>
    </ul>
    <p>Created by: ${createdBy.name}</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-app-url.com"}/projects/${project.id}" class="button">View Project</a>
  `
  return createBaseTemplate(content)
}

// Project member added template
export function getProjectMemberAddedTemplate(project: any, member: any, addedBy: User, role: string) {
  const content = `
    <h2>Added to Project</h2>
    <p>You have been added to a project:</p>
    <ul>
      <li><strong>Project Name:</strong> ${project.name}</li>
      <li><strong>Description:</strong> ${project.description || "No description provided"}</li>
      <li><strong>Your Role:</strong> ${role}</li>
      <li><strong>Start Date:</strong> ${project.start_date ? new Date(project.start_date).toLocaleDateString() : "Not specified"}</li>
      <li><strong>End Date:</strong> ${project.end_date ? new Date(project.end_date).toLocaleDateString() : "Not specified"}</li>
    </ul>
    <p>Added by: ${addedBy.name}</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-app-url.com"}/projects/${project.id}" class="button">View Project</a>
  `
  return createBaseTemplate(content)
}

// Milestone completed template
export function getMilestoneCompletedTemplate(project: any, milestone: any, completedBy: User) {
  const content = `
    <h2>Project Milestone Completed</h2>
    <p>A milestone has been completed in one of your projects:</p>
    <ul>
      <li><strong>Project:</strong> ${project.name}</li>
      <li><strong>Milestone:</strong> ${milestone.title}</li>
      <li><strong>Description:</strong> ${milestone.description || "No description provided"}</li>
      <li><strong>Completed Date:</strong> ${new Date().toLocaleDateString()}</li>
    </ul>
    <p>Completed by: ${completedBy.name}</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-app-url.com"}/projects/${project.id}" class="button">View Project</a>
  `
  return createBaseTemplate(content)
}

// Comment added template
export function getCommentAddedTemplate(
  entityType: "project" | "task",
  entityName: string,
  comment: any,
  commentedBy: User,
  projectName?: string,
) {
  const content = `
    <h2>New Comment Added</h2>
    <p>A new comment has been added to a ${entityType}:</p>
    <ul>
      <li><strong>${entityType === "project" ? "Project" : "Task"}:</strong> ${entityName}</li>
      ${projectName ? `<li><strong>Project:</strong> ${projectName}</li>` : ""}
      <li><strong>Comment:</strong> "${comment.content}"</li>
      <li><strong>Date:</strong> ${new Date(comment.created_at).toLocaleString()}</li>
    </ul>
    <p>Comment by: ${commentedBy.name}</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-app-url.com"}/${entityType}s/${comment[`${entityType}_id`]}" class="button">View ${entityType === "project" ? "Project" : "Task"}</a>
  `
  return createBaseTemplate(content)
}

// Clock In template
export function getClockInTemplate(user: User, clockInTime: string, date: string, location: string) {
  const content = `
    <h2>Clock In Confirmation</h2>
    <p>Hello ${user.name},</p>
    <p>Your attendance has been recorded successfully.</p>
    
    <ul>
      <li><strong>Date:</strong> ${date}</li>
      <li><strong>Clock In Time:</strong> ${clockInTime}</li>
      <li><strong>Location:</strong> ${location || "Not specified"}</li>
    </ul>
    
    <p>Have a productive day!</p>
  `
  return createBaseTemplate(content)
}

// Clock Out template
export function getClockOutTemplate(user: User, clockOutTime: string, date: string, hoursWorked: string) {
  const content = `
    <h2>Clock Out Confirmation</h2>
    <p>Hello ${user.name},</p>
    <p>You have successfully clocked out for the day.</p>
    
    <ul>
      <li><strong>Date:</strong> ${date}</li>
      <li><strong>Clock Out Time:</strong> ${clockOutTime}</li>
      <li><strong>Hours Worked:</strong> ${hoursWorked}</li>
    </ul>
    
    <p>Thank you for your work today!</p>
  `
  return createBaseTemplate(content)
}

// Leave Request Submitted template
export function getLeaveRequestSubmittedTemplate(
  user: User,
  leaveType: string,
  startDate: string,
  endDate: string,
  reason: string,
) {
  const content = `
    <h2>Leave Request Submitted</h2>
    <p>Hello ${user.name},</p>
    <p>Your leave request has been submitted successfully.</p>
    
    <ul>
      <li><strong>Leave Type:</strong> ${leaveType}</li>
      <li><strong>From:</strong> ${startDate}</li>
      <li><strong>To:</strong> ${endDate}</li>
      <li><strong>Reason:</strong> ${reason || "Not specified"}</li>
      <li><strong>Status:</strong> <span style="color: #ca8a04;">Pending</span></li>
    </ul>
    
    <p>You will be notified once your request has been reviewed.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-app-url.com"}/attendance/leave" class="button">View Leave Requests</a>
  `
  return createBaseTemplate(content)
}

// Leave Request Status Update template
export function getLeaveRequestUpdateTemplate(
  user: User,
  leaveType: string,
  startDate: string,
  endDate: string,
  status: "approved" | "rejected",
  notes?: string,
) {
  const statusColor = status === "approved" ? "#16a34a" : "#dc2626"
  const statusText = status === "approved" ? "Approved" : "Rejected"

  const content = `
    <h2>Leave Request ${statusText}</h2>
    <p>Hello ${user.name},</p>
    <p>Your leave request has been <span style="color: ${statusColor};">${statusText}</span>.</p>
    
    <ul>
      <li><strong>Leave Type:</strong> ${leaveType}</li>
      <li><strong>From:</strong> ${startDate}</li>
      <li><strong>To:</strong> ${endDate}</li>
      ${notes ? `<li><strong>Notes:</strong> ${notes}</li>` : ""}
    </ul>
    
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-app-url.com"}/attendance/leave" class="button">View Leave Requests</a>
  `
  return createBaseTemplate(content)
}

// Leave Request Manager Notification template
export function getLeaveRequestManagerTemplate(
  employee: User,
  manager: User,
  leaveType: string,
  startDate: string,
  endDate: string,
  reason: string,
) {
  const content = `
    <h2>New Leave Request</h2>
    <p>Hello ${manager.name},</p>
    <p>${employee.name} has submitted a leave request that requires your approval.</p>
    
    <ul>
      <li><strong>Employee:</strong> ${employee.name}</li>
      <li><strong>Leave Type:</strong> ${leaveType}</li>
      <li><strong>From:</strong> ${startDate}</li>
      <li><strong>To:</strong> ${endDate}</li>
      <li><strong>Reason:</strong> ${reason || "Not specified"}</li>
    </ul>
    
    <p>Please review and take appropriate action.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-app-url.com"}/attendance/leave/manage" class="button">Review Leave Requests</a>
  `
  return createBaseTemplate(content)
}

// Attendance Report template
export function getAttendanceReportTemplate(
  user: User,
  reportPeriod: string,
  totalDays: number,
  presentDays: number,
  absentDays: number,
  lateDays: number,
  totalHours: number,
) {
  const content = `
    <h2>Attendance Report</h2>
    <p>Hello ${user.name},</p>
    <p>Here is your attendance report for ${reportPeriod}:</p>
    
    <ul>
      <li><strong>Total Working Days:</strong> ${totalDays}</li>
      <li><strong>Days Present:</strong> ${presentDays}</li>
      <li><strong>Days Absent:</strong> ${absentDays}</li>
      <li><strong>Late Arrivals:</strong> ${lateDays}</li>
      <li><strong>Total Hours Worked:</strong> ${totalHours.toFixed(2)}</li>
      <li><strong>Attendance Rate:</strong> ${((presentDays / totalDays) * 100).toFixed(2)}%</li>
    </ul>
    
    <p>For detailed information, please check your attendance dashboard.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-app-url.com"}/attendance/reports" class="button">View Full Report</a>
  `
  return createBaseTemplate(content)
}

// Team Attendance Alert template
export function getTeamAttendanceAlertTemplate(
  manager: User,
  date: string,
  absentEmployees: string[],
  lateEmployees: string[],
) {
  const content = `
    <h2>Team Attendance Alert</h2>
    <p>Hello ${manager.name},</p>
    <p>Here is the attendance summary for your team on ${date}:</p>
    
    ${
      absentEmployees.length > 0
        ? `
    <h3>Absent Employees:</h3>
    <ul>
      ${absentEmployees.map((employee) => `<li>${employee}</li>`).join("")}
    </ul>
    `
        : ""
    }
    
    ${
      lateEmployees.length > 0
        ? `
    <h3>Late Employees:</h3>
    <ul>
      ${lateEmployees.map((employee) => `<li>${employee}</li>`).join("")}
    </ul>
    `
        : ""
    }
    
    ${
      absentEmployees.length === 0 && lateEmployees.length === 0
        ? `
    <p>All team members are present and on time today. Great job!</p>
    `
        : ""
    }
    
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-app-url.com"}/attendance/team" class="button">View Team Attendance</a>
  `
  return createBaseTemplate(content)
}
