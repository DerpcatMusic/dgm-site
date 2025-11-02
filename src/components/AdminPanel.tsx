import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Trash2, Plus, Save, LogOut, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Artist {
  id?: string;
  name: string;
  genre: string;
  bio: string;
  image_url: string;
  color: string;
  instagram: string;
  twitter: string;
  spotify: string;
  soundcloud: string;
  featured: boolean;
  order_index: number;
}

interface Release {
  id?: string;
  title: string;
  artist_name: string;
  artwork_url: string;
  year: string;
  color: string;
  spotify_url: string;
  apple_music_url: string;
  soundcloud_url: string;
  featured: boolean;
  order_index: number;
}

export default function AdminPanel() {
  const [user, setUser] = useState<any>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);
  const { theme, refreshTheme } = useTheme();
  const navigate = useNavigate();

  const [themeForm, setThemeForm] = useState({
    primary_color: '#3B82F6',
    secondary_color: '#EF4444',
    accent_color: '#FBBF24',
    extra_color_1: '#10B981',
    extra_color_2: '#8B5CF6',
    background_color: '#FFFFFF',
    border_color: '#000000',
    label_name: 'Dolmen Gate Media'
  });

  useEffect(() => {
    checkAuth();
    if (theme) {
      setThemeForm({
        primary_color: theme.primary_color,
        secondary_color: theme.secondary_color,
        accent_color: theme.accent_color,
        extra_color_1: theme.extra_color_1,
        extra_color_2: theme.extra_color_2,
        background_color: theme.background_color,
        border_color: theme.border_color,
        label_name: theme.label_name
      });
    }
  }, [theme]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      fetchData();
    }
  };

  const fetchData = async () => {
    const { data: artistsData } = await supabase.from('artists').select('*').order('order_index');
    const { data: releasesData } = await supabase.from('releases').select('*').order('order_index');
    if (artistsData) setArtists(artistsData);
    if (releasesData) setReleases(releasesData);
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/admin'
      }
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  const saveTheme = async () => {
    await supabase.from('theme_settings').update(themeForm).eq('id', '00000000-0000-0000-0000-000000000001');
    await refreshTheme();
    alert('Theme updated!');
  };

  const saveArtist = async (artist: Artist) => {
    if (artist.id) {
      await supabase.from('artists').update(artist).eq('id', artist.id);
    } else {
      await supabase.from('artists').insert([artist]);
    }
    setEditingArtist(null);
    fetchData();
  };

  const deleteArtist = async (id: string) => {
    if (confirm('Delete this artist?')) {
      await supabase.from('artists').delete().eq('id', id);
      fetchData();
    }
  };

  const saveRelease = async (release: Release) => {
    if (release.id) {
      await supabase.from('releases').update(release).eq('id', release.id);
    } else {
      await supabase.from('releases').insert([release]);
    }
    setEditingRelease(null);
    fetchData();
  };

  const deleteRelease = async (id: string) => {
    if (confirm('Delete this release?')) {
      await supabase.from('releases').delete().eq('id', id);
      fetchData();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Card className="w-full max-w-md border-8" style={{ borderColor: theme?.border_color }}>
          <CardHeader>
            <CardTitle className="text-4xl font-black text-center">ADMIN LOGIN</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={signInWithGoogle}
              className="w-full h-14 text-lg font-black border-4"
              style={{
                backgroundColor: theme?.primary_color,
                borderColor: theme?.border_color
              }}
            >
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-black">ADMIN PANEL</h1>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/')} variant="outline" className="border-4 font-black">
              VIEW SITE
            </Button>
            <Button onClick={signOut} variant="outline" className="border-4 font-black">
              <LogOut className="w-4 h-4 mr-2" />
              SIGN OUT
            </Button>
          </div>
        </div>

        <Tabs defaultValue="theme" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-14 border-4" style={{ borderColor: theme?.border_color }}>
            <TabsTrigger value="theme" className="font-black text-lg">
              <Palette className="w-5 h-5 mr-2" />
              THEME
            </TabsTrigger>
            <TabsTrigger value="artists" className="font-black text-lg">ARTISTS</TabsTrigger>
            <TabsTrigger value="releases" className="font-black text-lg">RELEASES</TabsTrigger>
          </TabsList>

          {/* THEME TAB */}
          <TabsContent value="theme">
            <Card className="border-8" style={{ borderColor: theme?.border_color }}>
              <CardHeader>
                <CardTitle className="text-3xl font-black">CUSTOMIZE THEME</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-lg font-black mb-2 block">LABEL NAME</Label>
                  <Input
                    value={themeForm.label_name}
                    onChange={(e) => setThemeForm({ ...themeForm, label_name: e.target.value })}
                    className="h-12 border-4 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: 'primary_color', label: 'Primary' },
                    { key: 'secondary_color', label: 'Secondary' },
                    { key: 'accent_color', label: 'Accent' },
                    { key: 'extra_color_1', label: 'Extra 1 (Green)' },
                    { key: 'extra_color_2', label: 'Extra 2 (Purple)' },
                    { key: 'background_color', label: 'Background' },
                    { key: 'border_color', label: 'Border' }
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <Label className="font-black mb-2 block">{label}</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={themeForm[key as keyof typeof themeForm]}
                          onChange={(e) => setThemeForm({ ...themeForm, [key]: e.target.value })}
                          className="h-12 w-16 border-4 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={themeForm[key as keyof typeof themeForm]}
                          onChange={(e) => setThemeForm({ ...themeForm, [key]: e.target.value })}
                          className="h-12 flex-1 border-4 font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={saveTheme}
                  className="w-full h-14 text-xl font-black border-4"
                  style={{
                    backgroundColor: theme?.primary_color,
                    borderColor: theme?.border_color
                  }}
                >
                  <Save className="w-5 h-5 mr-2" />
                  SAVE THEME
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ARTISTS TAB */}
          <TabsContent value="artists">
            <div className="space-y-4">
              <Button 
                onClick={() => setEditingArtist({
                  name: '', genre: '', bio: '', image_url: '', color: '#3B82F6',
                  instagram: '', twitter: '', spotify: '', soundcloud: '',
                  featured: true, order_index: artists.length
                })}
                className="border-4 font-black"
                style={{ borderColor: theme?.border_color }}
              >
                <Plus className="w-5 h-5 mr-2" />
                ADD ARTIST
              </Button>

              {editingArtist && (
                <Card className="border-8" style={{ borderColor: theme?.border_color }}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-black">
                      {editingArtist.id ? 'EDIT ARTIST' : 'NEW ARTIST'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="font-black">NAME</Label>
                        <Input
                          value={editingArtist.name}
                          onChange={(e) => setEditingArtist({ ...editingArtist, name: e.target.value })}
                          className="border-4"
                        />
                      </div>
                      <div>
                        <Label className="font-black">GENRE</Label>
                        <Input
                          value={editingArtist.genre}
                          onChange={(e) => setEditingArtist({ ...editingArtist, genre: e.target.value })}
                          className="border-4"
                        />
                      </div>
                      <div>
                        <Label className="font-black">IMAGE URL</Label>
                        <Input
                          value={editingArtist.image_url}
                          onChange={(e) => setEditingArtist({ ...editingArtist, image_url: e.target.value })}
                          className="border-4"
                        />
                      </div>
                      <div>
                        <Label className="font-black">COLOR</Label>
                        <Input
                          type="color"
                          value={editingArtist.color}
                          onChange={(e) => setEditingArtist({ ...editingArtist, color: e.target.value })}
                          className="border-4 h-10"
                        />
                      </div>
                      <div>
                        <Label className="font-black">INSTAGRAM</Label>
                        <Input
                          value={editingArtist.instagram}
                          onChange={(e) => setEditingArtist({ ...editingArtist, instagram: e.target.value })}
                          className="border-4"
                        />
                      </div>
                      <div>
                        <Label className="font-black">TWITTER</Label>
                        <Input
                          value={editingArtist.twitter}
                          onChange={(e) => setEditingArtist({ ...editingArtist, twitter: e.target.value })}
                          className="border-4"
                        />
                      </div>
                      <div>
                        <Label className="font-black">SPOTIFY</Label>
                        <Input
                          value={editingArtist.spotify}
                          onChange={(e) => setEditingArtist({ ...editingArtist, spotify: e.target.value })}
                          className="border-4"
                        />
                      </div>
                      <div>
                        <Label className="font-black">SOUNDCLOUD</Label>
                        <Input
                          value={editingArtist.soundcloud}
                          onChange={(e) => setEditingArtist({ ...editingArtist, soundcloud: e.target.value })}
                          className="border-4"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="font-black">BIO</Label>
                      <Textarea
                        value={editingArtist.bio}
                        onChange={(e) => setEditingArtist({ ...editingArtist, bio: e.target.value })}
                        className="border-4 min-h-24"
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button onClick={() => saveArtist(editingArtist)} className="flex-1 border-4 font-black">
                        SAVE
                      </Button>
                      <Button onClick={() => setEditingArtist(null)} variant="outline" className="border-4 font-black">
                        CANCEL
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {artists.map((artist) => (
                  <Card key={artist.id} className="border-4" style={{ borderColor: theme?.border_color }}>
                    <CardContent className="p-4">
                      <img src={artist.image_url} alt={artist.name} className="w-full aspect-square object-cover mb-2" />
                      <h3 className="font-black text-xl">{artist.name}</h3>
                      <p className="font-bold text-sm mb-4">{artist.genre}</p>
                      <div className="flex gap-2">
                        <Button onClick={() => setEditingArtist(artist)} size="sm" className="flex-1 border-2 font-black">
                          EDIT
                        </Button>
                        <Button onClick={() => deleteArtist(artist.id!)} size="sm" variant="destructive" className="border-2">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* RELEASES TAB */}
          <TabsContent value="releases">
            <div className="space-y-4">
              <Button 
                onClick={() => setEditingRelease({
                  title: '', artist_name: '', artwork_url: '', year: new Date().getFullYear().toString(),
                  color: '#3B82F6', spotify_url: '', apple_music_url: '', soundcloud_url: '',
                  featured: true, order_index: releases.length
                })}
                className="border-4 font-black"
                style={{ borderColor: theme?.border_color }}
              >
                <Plus className="w-5 h-5 mr-2" />
                ADD RELEASE
              </Button>

              {editingRelease && (
                <Card className="border-8" style={{ borderColor: theme?.border_color }}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-black">
                      {editingRelease.id ? 'EDIT RELEASE' : 'NEW RELEASE'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="font-black">TITLE</Label>
                        <Input
                          value={editingRelease.title}
                          onChange={(e) => setEditingRelease({ ...editingRelease, title: e.target.value })}
                          className="border-4"
                        />
                      </div>
                      <div>
                        <Label className="font-black">ARTIST NAME</Label>
                        <Input
                          value={editingRelease.artist_name}
                          onChange={(e) => setEditingRelease({ ...editingRelease, artist_name: e.target.value })}
                          className="border-4"
                        />
                      </div>
                      <div>
                        <Label className="font-black">ARTWORK URL</Label>
                        <Input
                          value={editingRelease.artwork_url}
                          onChange={(e) => setEditingRelease({ ...editingRelease, artwork_url: e.target.value })}
                          className="border-4"
                        />
                      </div>
                      <div>
                        <Label className="font-black">YEAR</Label>
                        <Input
                          value={editingRelease.year}
                          onChange={(e) => setEditingRelease({ ...editingRelease, year: e.target.value })}
                          className="border-4"
                        />
                      </div>
                      <div>
                        <Label className="font-black">COLOR</Label>
                        <Input
                          type="color"
                          value={editingRelease.color}
                          onChange={(e) => setEditingRelease({ ...editingRelease, color: e.target.value })}
                          className="border-4 h-10"
                        />
                      </div>
                      <div>
                        <Label className="font-black">SPOTIFY URL</Label>
                        <Input
                          value={editingRelease.spotify_url}
                          onChange={(e) => setEditingRelease({ ...editingRelease, spotify_url: e.target.value })}
                          className="border-4"
                        />
                      </div>
                      <div>
                        <Label className="font-black">APPLE MUSIC URL</Label>
                        <Input
                          value={editingRelease.apple_music_url}
                          onChange={(e) => setEditingRelease({ ...editingRelease, apple_music_url: e.target.value })}
                          className="border-4"
                        />
                      </div>
                      <div>
                        <Label className="font-black">SOUNDCLOUD URL</Label>
                        <Input
                          value={editingRelease.soundcloud_url}
                          onChange={(e) => setEditingRelease({ ...editingRelease, soundcloud_url: e.target.value })}
                          className="border-4"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button onClick={() => saveRelease(editingRelease)} className="flex-1 border-4 font-black">
                        SAVE
                      </Button>
                      <Button onClick={() => setEditingRelease(null)} variant="outline" className="border-4 font-black">
                        CANCEL
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {releases.map((release) => (
                  <Card key={release.id} className="border-4" style={{ borderColor: theme?.border_color }}>
                    <CardContent className="p-4">
                      <img src={release.artwork_url} alt={release.title} className="w-full aspect-square object-cover mb-2" />
                      <h3 className="font-black text-lg">{release.title}</h3>
                      <p className="font-bold text-sm mb-2">{release.artist_name}</p>
                      <p className="text-xs font-bold mb-4">{release.year}</p>
                      <div className="flex gap-2">
                        <Button onClick={() => setEditingRelease(release)} size="sm" className="flex-1 border-2 font-black">
                          EDIT
                        </Button>
                        <Button onClick={() => deleteRelease(release.id!)} size="sm" variant="destructive" className="border-2">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
