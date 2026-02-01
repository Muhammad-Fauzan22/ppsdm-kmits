'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, CheckCircle, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Certificate {
  id: string;
  course_title: string;
  issue_date: string;
  certificate_number: string;
  status: 'earned' | 'in_progress';
  progress?: number;
}

export default function CertificatesPage() {
  const [certificates] = useState<Certificate[]>([
    { id: '1', course_title: 'Project Management', issue_date: '2024-01-15', certificate_number: 'ITS-001', status: 'earned' },
    { id: '2', course_title: 'Leadership', issue_date: '2024-01-20', certificate_number: 'ITS-002', status: 'earned' },
    { id: '3', course_title: 'Communication', issue_date: '', certificate_number: '', status: 'in_progress', progress: 65 }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-8">
          <Award className="w-8 h-8 text-blue-600" />
          My Certificates
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`h-full ${cert.status === 'earned' ? 'border-green-300' : ''}`}>
                <CardHeader>
                  <Badge className={cert.status === 'earned' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {cert.status === 'earned' ? 'Earned' : 'In Progress'}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <Award className={`w-16 h-16 mx-auto mb-4 ${cert.status === 'earned' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <h3 className="font-semibold mb-2">{cert.course_title}</h3>
                  {cert.status === 'earned' ? (
                    <>
                      <p className="text-sm text-gray-500 mb-4">{cert.issue_date}</p>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${cert.progress}%` }} />
                      </div>
                      <p className="text-sm text-gray-600">{cert.progress}% complete</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
