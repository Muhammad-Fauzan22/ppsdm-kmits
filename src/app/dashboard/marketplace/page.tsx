'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Upload, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const mockContent = [
  { id: '1', title: 'Leadership Guide', author: 'Prof. Smith', price: 0, rating: 4.8, thumbnail: '📚' },
  { id: '2', title: 'Public Speaking', author: 'Dr. Johnson', price: 50000, rating: 4.9, thumbnail: '🎤' },
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredContent = mockContent.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <Button><Upload className="h-4 w-4 mr-2" /> Upload</Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredContent.map(item => (
          <motion.div key={item.id} whileHover={{ y: -5 }}>
            <Card className="cursor-pointer hover:shadow-lg">
              <div className="h-32 bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-6xl">{item.thumbnail}</div>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm"><Star className="h-4 w-4 text-yellow-500" /> {item.rating}</div>
                  {item.price === 0 ? <Badge>Free</Badge> : <span className="font-semibold">Rp {item.price.toLocaleString()}</span>}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
