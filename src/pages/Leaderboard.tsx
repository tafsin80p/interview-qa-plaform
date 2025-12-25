import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Trophy, Medal, Award, Clock, Target, Puzzle, Palette, Loader2 } from 'lucide-react';

type QuizType = 'plugin' | 'theme' | 'all';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'all';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  quiz_type: 'plugin' | 'theme';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  score: number;
  total_questions: number;
  time_taken_seconds: number;
  completed_at: string;
  display_name: string | null;
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<QuizType>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyLevel>('all');

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);

    if (!isSupabaseConfigured) {
      setEntries([]);
      setLoading(false);
      return;
    }

    let query = supabase
      .from('quiz_results')
      .select('*')
      .order('score', { ascending: false })
      .order('time_taken_seconds', { ascending: true })
      .limit(50);

    if (filterType !== 'all') {
      query = query.eq('quiz_type', filterType);
    }

    if (filterDifficulty !== 'all') {
      query = query.eq('difficulty', filterDifficulty);
    }

    const { data: results, error } = await query;

    if (error || !results) {
      setLoading(false);
      return;
    }

    // Fetch profiles separately
    const userIds = [...new Set(results.map(r => r.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, display_name')
      .in('user_id', userIds);

    const profileMap = new Map(profiles?.map(p => [p.user_id, p.display_name]) || []);

    const entriesWithNames: LeaderboardEntry[] = results.map(r => ({
      ...r,
      display_name: profileMap.get(r.user_id) || null,
    }));

    setEntries(entriesWithNames);
    setLoading(false);
  }, [filterType, filterDifficulty]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-mono text-muted-foreground">{index + 1}</span>;
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Type:</span>
              <Select value={filterType} onValueChange={(v) => setFilterType(v as QuizType)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="plugin">Plugin</SelectItem>
                  <SelectItem value="theme">Theme</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Difficulty:</span>
              <Select value={filterDifficulty} onValueChange={(v) => setFilterDifficulty(v as DifficultyLevel)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No results yet. Be the first to complete a quiz!</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-2 p-4 bg-secondary/50 text-sm font-medium text-muted-foreground border-b border-border">
              <div className="col-span-1">#</div>
              <div className="col-span-3">Player</div>
              <div className="col-span-2">Quiz</div>
              <div className="col-span-2">Level</div>
              <div className="col-span-2 flex items-center gap-1">
                <Target className="w-3 h-3" /> Score
              </div>
              <div className="col-span-2 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Time
              </div>
            </div>

            <div className="divide-y divide-border">
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`grid grid-cols-12 gap-2 p-4 items-center ${
                    index < 3 ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="col-span-1">
                    {getRankIcon(index)}
                  </div>
                  <div className="col-span-3 font-medium text-foreground truncate">
                    {entry.display_name || 'Anonymous'}
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-1">
                      {entry.quiz_type === 'plugin' ? (
                        <Puzzle className="w-4 h-4 text-primary" />
                      ) : (
                        <Palette className="w-4 h-4 text-accent" />
                      )}
                      <span className="text-sm capitalize">{entry.quiz_type}</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-secondary rounded capitalize">
                      {entry.difficulty}
                    </span>
                  </div>
                  <div className="col-span-2 font-mono text-foreground">
                    {Math.round((entry.score / entry.total_questions) * 100)}%
                    <span className="text-xs text-muted-foreground ml-1">
                      ({entry.score}/{entry.total_questions})
                    </span>
                  </div>
                  <div className="col-span-2 font-mono text-muted-foreground">
                    {formatTime(entry.time_taken_seconds)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
