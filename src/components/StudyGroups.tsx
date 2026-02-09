'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, MessageCircle, BookOpen, Crown, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useStudyGroups } from '@/lib/hooks/useStudyGroups';
import { StudyGroupsListSkeleton } from '@/components/dashboard/LoadingSkeletons';
import { ErrorDisplay } from '@/components/dashboard/ErrorDisplay';


interface StudyGroup {
  id: string;
  name: string;
  description: string;
  courseName?: string;
  members: number;
  maxMembers: number;
  isPrivate: boolean;
  isJoined?: boolean;
  tags: string[];
}

export function StudyGroups({ className }: { className?: string }) {
  const { data: groups, isLoading, error, joinGroup } = useStudyGroups();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  if (isLoading) {
    return <StudyGroupsListSkeleton />;
  }

  if (error) {
    return <ErrorDisplay message={error.message} />;
  }



  if (!groups || groups.length === 0) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Study Groups</h2>
            <p className="text-muted-foreground">Belum ada grup studi yang tersedia</p>
          </div>
          <Button><Plus className="h-4 w-4 mr-2" /> Buat Grup</Button>
        </div>
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <Users className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">Belum Ada Grup Studi</h3>
          <p className="text-slate-500 mt-2">Jadilah yang pertama membuat grup studi!</p>
          <Button className="mt-4"><Plus className="h-4 w-4 mr-2" /> Buat Grup Pertama</Button>
        </div>
      </div>
    );
  }

  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const myGroups = filteredGroups.filter(g => g.isJoined);
  const availableGroups = filteredGroups.filter(g => !g.isJoined && !g.isPrivate);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Study Groups</h2>
          <p className="text-muted-foreground">Learn together, grow together</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> Create</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search groups..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          className="pl-10" 
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({filteredGroups.length})</TabsTrigger>
          <TabsTrigger value="my">My ({myGroups.length})</TabsTrigger>
          <TabsTrigger value="available">Available ({availableGroups.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map(group => (
              <GroupCard key={group.id} group={group} onJoin={() => joinGroup(group.id)} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myGroups.map(group => (
              <GroupCard key={group.id} group={group} onJoin={() => {}} isJoined />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableGroups.map(group => (
              <GroupCard key={group.id} group={group} onJoin={() => joinGroup(group.id)} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GroupCard({ group, onJoin, isJoined = false }: { 
  group: StudyGroup; 
  onJoin: () => void; 
  isJoined?: boolean 
}) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">{group.name}</CardTitle>
                {group.courseName && (
                  <CardDescription className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> {group.courseName}
                  </CardDescription>
                )}
              </div>
            </div>
            {group.isPrivate && (
              <Badge variant="secondary">
                <Crown className="h-3 w-3 mr-1" /> Private
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{group.description}</p>
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{group.members}/{group.maxMembers}</span>
            </div>
            {isJoined ? (
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" /> Chat
              </Button>
            ) : (
              <Button size="sm" onClick={onJoin}>
                <UserPlus className="h-4 w-4 mr-2" /> Join
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default StudyGroups;
