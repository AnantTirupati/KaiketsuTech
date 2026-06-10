export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'client' | 'intern'
          avatar_url: string | null
          updated_at: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'client' | 'intern'
          avatar_url?: string | null
          updated_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'client' | 'intern'
          avatar_url?: string | null
          updated_at?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      project_requests: {
        Row: {
          id: string
          client_id: string | null
          first_name: string | null
          last_name: string | null
          work_email: string | null
          job_title: string | null
          company_name: string | null
          project_scope: string | null
          project_description: string | null
          timeline_weeks: number | null
          status: 'pending' | 'approved' | 'rejected'
          created_at: string | null
          phone: string | null
          project_title: string | null
          business_goals: string | null
          budget: number | null
          priority: 'low' | 'medium' | 'high' | 'critical' | null
        }
        Insert: {
          id?: string
          client_id?: string | null
          first_name?: string | null
          last_name?: string | null
          work_email?: string | null
          job_title?: string | null
          company_name?: string | null
          project_scope?: string | null
          project_description?: string | null
          timeline_weeks?: number | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string | null
          phone?: string | null
          project_title?: string | null
          business_goals?: string | null
          budget?: number | null
          priority?: 'low' | 'medium' | 'high' | 'critical' | null
        }
        Update: {
          id?: string
          client_id?: string | null
          first_name?: string | null
          last_name?: string | null
          work_email?: string | null
          job_title?: string | null
          company_name?: string | null
          project_scope?: string | null
          project_description?: string | null
          timeline_weeks?: number | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string | null
          phone?: string | null
          project_title?: string | null
          business_goals?: string | null
          budget?: number | null
          priority?: 'low' | 'medium' | 'high' | 'critical' | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          client_id: string | null
          title: string
          description: string | null
          status: 'planning' | 'in_progress' | 'review' | 'completed'
          velocity: number
          capacity_utilization: number
          estimated_budget: number | null
          timeline_start: string | null
          timeline_end: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          client_id?: string | null
          title: string
          description?: string | null
          status?: 'planning' | 'in_progress' | 'review' | 'completed'
          velocity?: number
          capacity_utilization?: number
          estimated_budget?: number | null
          timeline_start?: string | null
          timeline_end?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string | null
          title?: string
          description?: string | null
          status?: 'planning' | 'in_progress' | 'review' | 'completed'
          velocity?: number
          capacity_utilization?: number
          estimated_budget?: number | null
          timeline_start?: string | null
          timeline_end?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          project_id: string | null
          assigned_to: string | null
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'done'
          category: 'Frontend' | 'Backend' | 'Design Sys' | 'Other'
          due_date: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          project_id?: string | null
          assigned_to?: string | null
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'done'
          category?: 'Frontend' | 'Backend' | 'Design Sys' | 'Other'
          due_date?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string | null
          assigned_to?: string | null
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'done'
          category?: 'Frontend' | 'Backend' | 'Design Sys' | 'Other'
          due_date?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      milestones: {
        Row: {
          id: string
          project_id: string | null
          title: string
          description: string | null
          due_date: string | null
          status: 'pending' | 'completed'
          created_at: string | null
        }
        Insert: {
          id?: string
          project_id?: string | null
          title: string
          description?: string | null
          due_date?: string | null
          status?: 'pending' | 'completed'
          created_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string | null
          title?: string
          description?: string | null
          due_date?: string | null
          status?: 'pending' | 'completed'
          created_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          sender_id: string | null
          project_id: string | null
          content: string
          file_url: string | null
          file_name: string | null
          created_at: string | null
          conversation_id: string | null
        }
        Insert: {
          id?: string
          sender_id?: string | null
          project_id?: string | null
          content: string
          file_url?: string | null
          file_name?: string | null
          created_at?: string | null
          conversation_id?: string | null
        }
        Update: {
          id?: string
          sender_id?: string | null
          project_id?: string | null
          content?: string
          file_url?: string | null
          file_name?: string | null
          created_at?: string | null
          conversation_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          client_id: string | null
          amount: number
          currency: string
          status: 'pending' | 'completed' | 'failed'
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          package_type: 'starter' | 'business' | 'enterprise' | null
          created_at: string | null
        }
        Insert: {
          id?: string
          client_id?: string | null
          amount: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed'
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          package_type?: 'starter' | 'business' | 'enterprise' | null
          created_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string | null
          amount?: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed'
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          package_type?: 'starter' | 'business' | 'enterprise' | null
          created_at?: string | null
        }
        Relationships: []
      }
      contact_inquiries: {
        Row: {
          id: string
          full_name: string
          organization: string | null
          email: string
          subject: string | null
          message: string
          created_at: string | null
        }
        Insert: {
          id?: string
          full_name: string
          organization?: string | null
          email: string
          subject?: string | null
          message: string
          created_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          organization?: string | null
          email?: string
          subject?: string | null
          message?: string
          created_at?: string | null
        }
        Relationships: []
      }
      intern_applications: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          skills: string | null
          technologies: string | null
          experience: string | null
          portfolio_url: string | null
          github_url: string | null
          linkedin_url: string | null
          resume_url: string | null
          status: 'pending' | 'approved' | 'rejected'
          created_at: string | null
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone?: string | null
          skills?: string | null
          technologies?: string | null
          experience?: string | null
          portfolio_url?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          resume_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          skills?: string | null
          technologies?: string | null
          experience?: string | null
          portfolio_url?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          resume_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          id: string
          project_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          project_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
