import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { NotesManager } from '../../components/admin/NotesManager';
import { QuestionPapersManager } from '../../components/admin/QuestionPapersManager';
import { MCQManager } from '../../components/admin/MCQManager';
import { SyllabusEditor } from '../../components/admin/SyllabusEditor';
import { ContentSetup } from '../../components/admin/ContentSetup';

export default function AdminPanelPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>
        <p className="text-muted-foreground">
          Manage study materials, question papers, MCQs, and syllabus content
        </p>
      </div>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="papers">Papers</TabsTrigger>
          <TabsTrigger value="mcqs">MCQs</TabsTrigger>
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle>Content Setup</CardTitle>
              <CardDescription>
                Create branches, semesters, and subjects before adding study materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentSetup />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Manage Notes</CardTitle>
              <CardDescription>Upload and manage PDF study notes for subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <NotesManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="papers">
          <Card>
            <CardHeader>
              <CardTitle>Manage Question Papers</CardTitle>
              <CardDescription>Upload and manage previous year question papers</CardDescription>
            </CardHeader>
            <CardContent>
              <QuestionPapersManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mcqs">
          <Card>
            <CardHeader>
              <CardTitle>Manage MCQs</CardTitle>
              <CardDescription>Create and manage multiple choice questions</CardDescription>
            </CardHeader>
            <CardContent>
              <MCQManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="syllabus">
          <Card>
            <CardHeader>
              <CardTitle>Manage Syllabus</CardTitle>
              <CardDescription>Edit syllabus content for subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <SyllabusEditor />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
