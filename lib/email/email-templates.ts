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
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          padding: 32px 20px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          letter-spacing: -0.025em;
        }
        .content {
          padding: 32px 24px;
        }
        .content h2 {
          color: #111827;
          font-size: 20px;
          font-weight: 600;
          margin-top: 0;
          margin-bottom: 24px;
        }
        .content p {
          color: #374151;
          margin-bottom: 16px;
        }
        .content ul {
          list-style: none;
          padding: 0;
          margin: 20px 0;
          background: #f9fafb;
          border-radius: 8px;
          overflow: hidden;
        }
        .content ul li {
          padding: 12px 16px;
          border-bottom: 1px solid #e5e7eb;
        }
        .content ul li:last-child {
          border-bottom: none;
        }
        .content ul li strong {
          color: #4b5563;
          margin-right: 8px;
        }
        .footer {
          background-color: #f9fafb;
          padding: 24px 20px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          border-top: 1px solid #e5e7eb;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background: #4f46e5;
          color: white !important;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          margin-top: 24px;
          text-align: center;
          transition: background-color 0.2s;
        }
        .button:hover {
          background: #4338ca;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }
        .status-pending { background-color: #fef3c7; color: #92400e; }
        .status-approved { background-color: #dcfce7; color: #166534; }
        .status-rejected { background-color: #fee2e2; color: #991b1b; }
        .meta-info {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .highlight-box {
          background: #f0f9ff;
          border-left: 4px solid #3b82f6;
          padding: 16px;
          margin: 24px 0;
          border-radius: 0 8px 8px 0;
        }
        @media (max-width: 600px) {
          .container {
            margin: 0;
            border-radius: 0;
          }
          .content {
            padding: 24px 16px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 OpsFlow</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} OpsFlow. All rights reserved.</p>
          <p style="margin-top: 8px; opacity: 0.8;">This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// New team member template
export function getNewTeamMemberTemplate(member: any, addedBy: User) {
  const content = `
    <h2>👋 Welcome New Team Member!</h2>
    <div class="highlight-box">
      <p>We're excited to welcome <strong>${member.name}</strong> to our organization!</p>
    </div>
    <ul>
      <li><strong>Name:</strong> ${member.name}</li>
      <li><strong>Email:</strong> ${member.email}</li>
      <li><strong>Role:</strong> <span class="status-badge" style="background-color: #e0e7ff; color: #3730a3;">${member.role}</span></li>
      <li><strong>Department:</strong> ${member.department || "Not specified"}</li>
      <li><strong>Status:</strong> <span class="status-badge status-approved">${member.status}</span></li>
    </ul>
    <div class="meta-info">
      Added by ${addedBy.name}
    </div>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-app-url.com"}/team" class="button">View Team →</a>
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
  const getStatusBadgeStyle = (status: string) => {
    const styles = {
      'todo': { bg: '#f3f4f6', color: '#374151' },
      'in-progress': { bg: '#e0f2fe', color: '#0369a1' },
      'review': { bg: '#fef3c7', color: '#92400e' },
      'done': { bg: '#dcfce7', color: '#166534' }
    } as const

    const normalizedStatus = status.toLowerCase()
    return (normalizedStatus in styles ? styles[normalizedStatus as keyof typeof styles] : styles.todo)
  }

  const content = `
    <h2>📋 Task Status Updated</h2>
    <div class="highlight-box">
      <p>The status of task <strong>${task.title}</strong> has been updated.</p>
    </div>
    <ul>
      <li><strong>Task:</strong> ${task.title}</li>
      <li><strong>Project:</strong> ${projectName}</li>
      <li>
        <strong>Status Change:</strong> 
        <span class="status-badge" style="background: ${getStatusBadgeStyle(oldStatus).bg}; color: ${getStatusBadgeStyle(oldStatus).color}">
          ${oldStatus}
        </span>
        →
        <span class="status-badge" style="background: ${getStatusBadgeStyle(task.status).bg}; color: ${getStatusBadgeStyle(task.status).color}">
          ${task.status}
        </span>
      </li>
      <li><strong>Due Date:</strong> ${task.due_date ? new Date(task.due_date).toLocaleDateString() : "Not specified"}</li>
    </ul>
    <div class="meta-info">
      Updated by ${updatedBy.name}
    </div>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-app-url.com"}/tasks/${task.id}" class="button">View Task →</a>
  `
  return createBaseTemplate(content)
}

// New project template
export function getNewProjectTemplate(project: any, createdBy: User) {
  const content = `
    <h2>🎉 New Project Created</h2>
    <div class="highlight-box">
      <p>A new project <strong>${project.name}</strong> has been created and is ready for collaboration!</p>
    </div>
    <ul>
      <li><strong>Project Name:</strong> ${project.name}</li>
      <li><strong>Description:</strong> ${project.description || "No description provided"}</li>
      <li><strong>Start Date:</strong> ${project.start_date ? new Date(project.start_date).toLocaleDateString() : "Not specified"}</li>
      <li><strong>End Date:</strong> ${project.end_date ? new Date(project.end_date).toLocaleDateString() : "Not specified"}</li>
      <li><strong>Status:</strong> <span class="status-badge" style="background-color: #ddd6fe; color: #5b21b6;">${project.status}</span></li>
    </ul>
    <div class="meta-info">
      Created by ${createdBy.name}
    </div>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-app-url.com"}/projects/${project.id}" class="button">View Project →</a>
  `
  return createBaseTemplate(content)
}

// Project member added template
export function getProjectMemberAddedTemplate(project: any, member: any, addedBy: User, role: string) {
  const content = `
    <h2>🤝 Welcome to the Project!</h2>
    <div class="highlight-box">
      <p>You have been added to <strong>${project.name}</strong> as a <strong>${role}</strong>.</p>
    </div>
    <ul>
      <li><strong>Project Name:</strong> ${project.name}</li>
      <li><strong>Description:</strong> ${project.description || "No description provided"}</li>
      <li><strong>Your Role:</strong> <span class="status-badge" style="background-color: #e0e7ff; color: #3730a3;">${role}</span></li>
      <li><strong>Start Date:</strong> ${project.start_date ? new Date(project.start_date).toLocaleDateString() : "Not specified"}</li>
      <li><strong>End Date:</strong> ${project.end_date ? new Date(project.end_date).toLocaleDateString() : "Not specified"}</li>
    </ul>
    <div class="meta-info">
      Added by ${addedBy.name}
    </div>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-app-url.com"}/projects/${project.id}" class="button">View Project →</a>
  `
  return createBaseTemplate(content)
}

// Milestone completed template
export function getMilestoneCompletedTemplate(project: any, milestone: any, completedBy: User) {
  const content = `
    <h2>🎯 Milestone Achieved!</h2>
    <div class="highlight-box">
      <p>A significant milestone has been completed in project <strong>${project.name}</strong>!</p>
    </div>
    <ul>
      <li><strong>Project:</strong> ${project.name}</li>
      <li><strong>Milestone:</strong> ${milestone.title}</li>
      <li><strong>Description:</strong> ${milestone.description || "No description provided"}</li>
      <li><strong>Completion Date:</strong> <span class="status-badge status-approved">${new Date().toLocaleDateString()}</span></li>
    </ul>
    <div class="meta-info">
      Completed by ${completedBy.name}
    </div>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-app-url.com"}/projects/${project.id}" class="button">View Project →</a>
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
    <h2>💬 New Comment Added</h2>
    <div class="highlight-box">
      <p>A new comment has been added to ${entityType} <strong>${entityName}</strong></p>
    </div>
    <ul>
      <li><strong>${entityType === "project" ? "Project" : "Task"}:</strong> ${entityName}</li>
      ${projectName ? `<li><strong>Project:</strong> ${projectName}</li>` : ""}
      <li>
        <strong>Comment:</strong>
        <div style="margin-top: 8px; padding: 12px; background: #fff; border-radius: 6px; border: 1px solid #e5e7eb;">
          "${comment.content}"
        </div>
      </li>
      <li><strong>Date:</strong> ${new Date(comment.created_at).toLocaleString()}</li>
    </ul>
    <div class="meta-info">
      Comment by ${commentedBy.name}
    </div>
    <a href="${
      process.env.NEXT_PUBLIC_APP_URL || "https://your-app-url.com"
    }/${entityType}s/${comment[`${entityType}_id`]}" class="button">View ${
    entityType === "project" ? "Project" : "Task"
  } →</a>
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
