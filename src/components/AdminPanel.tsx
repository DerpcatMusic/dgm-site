import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Trash2, Plus, Save, LogOut, Palette, Mail, Eye, EyeOff, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

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
  image_file?: File;
}

interface Release {
  id?: string;
  title: string;
  artist_name: string;
  artist_id?: string | null;
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
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const { theme, refreshTheme } = useTheme();
  const navigate = useNavigate();

  // Email auth states
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [loading, setLoading] = useState(false);

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

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        await checkAdminStatus(session.user);
        fetchData();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdmin(false);
        setCheckingAdmin(true);
      }
    });

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (checkingAdmin) {
        console.warn('Auth check timed out, setting checkingAdmin to false');
        setCheckingAdmin(false);
      }
    }, 10000); // 10 second timeout

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [theme, checkingAdmin]);

  const checkAdminStatus = async (currentUser = user) => {
    if (!currentUser) {
      setIsAdmin(false);
      setCheckingAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', currentUser.email)
        .single();

      setIsAdmin(!error && data);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setCheckingAdmin(false);
    }
  };

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error && error.name !== 'AuthSessionMissingError') {
        throw error;
      }
      if (user) {
        setUser(user);
        await checkAdminStatus(user);
        fetchData();
      } else {
        // No user logged in, stop checking admin status
        setCheckingAdmin(false);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      alert('Authentication error. Please try logging in again.');
      setCheckingAdmin(false);
    }
  };

  const fetchData = async () => {
    try {
      const { data: artistsData, error: artistsError } = await supabase.from('artists').select('*').order('order_index');
      const { data: releasesData, error: releasesError } = await supabase.from('releases').select('*').order('order_index');
      if (artistsError) throw artistsError;
      if (releasesError) throw releasesError;
      if (artistsData) setArtists(artistsData);
      if (releasesData) setReleases(releasesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load data. Please refresh the page.');
    }
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/admin'
      }
    });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // User will be set via the auth state change listener
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      alert(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  const validateRelease = (release: Release): {[key: string]: string} => {
    const errors: {[key: string]: string} = {};
    
    // Title validation
    if (!release.title?.trim()) {
      errors.title = 'Title is required';
    } else if (release.title.length > 200) {
      errors.title = 'Title must be 200 characters or less';
    } else if (!/^[a-zA-Z0-9\s\-_.,:!?'"()&]+$/.test(release.title)) {
      errors.title = 'Title contains invalid characters. Only letters, numbers, spaces, and basic punctuation allowed.';
    }

    // Artist name validation
    if (!release.artist_name?.trim()) {
      errors.artist_name = 'Artist name is required';
    } else if (release.artist_name.length > 100) {
      errors.artist_name = 'Artist name must be 100 characters or less';
    } else if (!/^[a-zA-Z0-9\s\-_.,:!?'"()&]+$/.test(release.artist_name)) {
      errors.artist_name = 'Artist name contains invalid characters. Only letters, numbers, spaces, and basic punctuation allowed.';
    }

    // Artwork URL validation
    if (!release.artwork_url?.trim()) {
      errors.artwork_url = 'Artwork URL is required';
    } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(release.artwork_url)) {
      errors.artwork_url = 'Please enter a valid image URL (jpg, jpeg, png, gif, webp, svg)';
    }

    // Year validation
    if (!release.year?.trim()) {
      errors.year = 'Year is required';
    } else if (!/^\d{4}$/.test(release.year)) {
      errors.year = 'Please enter a valid 4-digit year';
    } else {
      const yearNum = parseInt(release.year);
      const currentYear = new Date().getFullYear();
      if (yearNum < 1900 || yearNum > currentYear + 5) {
        errors.year = `Year must be between 1900 and ${currentYear + 5}`;
      }
    }

    // Color validation (hex color)
    if (!release.color?.trim()) {
      errors.color = 'Color is required';
    } else if (!/^#[0-9A-Fa-f]{6}$/.test(release.color)) {
      errors.color = 'Please enter a valid hex color (e.g., #FF0000)';
    }

    // URL validations (optional fields)
    if (release.spotify_url && !/^https?:\/\/(open\.spotify\.com|spotify\.com)\/.+$/i.test(release.spotify_url)) {
      errors.spotify_url = 'Please enter a valid Spotify URL';
    }
    if (release.apple_music_url && !/^https?:\/\/.*music\.apple\.com\/.+$/i.test(release.apple_music_url)) {
      errors.apple_music_url = 'Please enter a valid Apple Music URL';
    }
    if (release.soundcloud_url && !/^https?:\/\/soundcloud\.com\/.+$/i.test(release.soundcloud_url)) {
      errors.soundcloud_url = 'Please enter a valid SoundCloud URL';
    }

    return errors;
  };

  const validateArtist = (artist: Artist): {[key: string]: string} => {
    const errors: {[key: string]: string} = {};

    // Name validation
    if (!artist.name?.trim()) {
      errors.name = 'Artist name is required';
    } else if (artist.name.length > 100) {
      errors.name = 'Artist name must be 100 characters or less';
    } else if (!/^[a-zA-Z0-9\s\-_.'&]+$/.test(artist.name)) {
      errors.name = 'Artist name can only contain letters, numbers, spaces, and basic punctuation';
    }

    // Genre validation
    if (artist.genre?.trim() && (artist.genre.length > 50 || !/^[a-zA-Z0-9\s\-_.'&]+$/.test(artist.genre))) {
      errors.genre = 'Genre must be 50 characters or less and contain only letters, numbers, spaces, and basic punctuation';
    }

    // Image URL validation
    if (artist.image_url?.trim() && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(artist.image_url)) {
      errors.image_url = 'Image URL must be a valid image URL (jpg, jpeg, png, gif, webp, svg)';
    }

    // Color validation
    if (artist.color?.trim() && !artist.color.match(/^#[0-9A-Fa-f]{6}$/)) {
      errors.color = 'Color must be a valid hex color (e.g., #FF0000)';
    }

    // Bio validation
    if (artist.bio?.trim() && artist.bio.length > 1000) {
      errors.bio = 'Bio must be 1000 characters or less';
    }

    // URL validations
    if (artist.spotify?.trim() && !artist.spotify.includes('spotify.com')) {
      errors.spotify = 'Spotify URL must be a valid Spotify link';
    }
    if (artist.instagram?.trim() && !artist.instagram.includes('instagram.com') && !artist.instagram.startsWith('@')) {
      errors.instagram = 'Instagram must be a valid Instagram URL or @username';
    }
    if (artist.twitter?.trim() && !artist.twitter.includes('twitter.com') && !artist.twitter.startsWith('@')) {
      errors.twitter = 'Twitter must be a valid Twitter URL or @username';
    }
    if (artist.soundcloud?.trim() && !artist.soundcloud.includes('soundcloud.com')) {
      errors.soundcloud = 'SoundCloud URL must be a valid SoundCloud link';
    }

    return errors;
  };

  const getDetailedErrorMessage = (error: any): string => {
    if (!error) return 'An unknown error occurred';
    
    // Supabase error handling
    if (error.code) {
      switch (error.code) {
        case 'PGRST116':
          return 'Access denied. You must be an admin to perform this action.';
        case '23505':
          return 'This record already exists. Please check for duplicates.';
        case '23503':
          return 'Invalid reference. Please check that all referenced items exist.';
        case '23502':
          return 'Missing required field. Please fill in all required fields.';
        case '23514':
          return 'Invalid data format. Please check your input values.';
        case 'PGRST301':
          return 'JWT expired. Please log in again.';
        case 'PGRST302':
          return 'Invalid JWT. Please log in again.';
        default:
          return error.message || 'Database error occurred';
      }
    }
    
    return error.message || 'An error occurred while saving';
  };

  const saveTheme = async () => {
    if (!user) {
      alert('You must be logged in to save changes.');
      return;
    }
    try {
      const { error } = await supabase.from('theme_settings').update(themeForm).eq('id', '00000000-0000-0000-0000-000000000001');
      if (error) throw error;
      await refreshTheme();
      alert('Theme updated!');
    } catch (error) {
      console.error('Error saving theme:', error);
      alert('Failed to save theme. Please try again.');
    }
  };

  const saveArtist = async (artist: Artist) => {
    if (!user) {
      alert('You must be logged in to save changes.');
      return;
    }
    
    // Clear previous errors
    setFormErrors({});
    
    // Validate artist data
    const validationErrors = validateArtist(artist);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      // Show first error in alert
      const firstError = Object.values(validationErrors)[0];
      alert(`Validation Error: ${firstError}`);
      return;
    }
    
    try {
      let imageUrl = artist.image_url;

      // Upload image if a file was selected
      if (artist.image_file) {
        const fileExt = artist.image_file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `artist-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('artist-images')
          .upload(filePath, artist.image_file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('artist-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const artistData = {
        name: artist.name.trim(),
        genre: artist.genre.trim(),
        bio: artist.bio.trim(),
        image_url: imageUrl,
        color: artist.color.trim(),
        instagram: artist.instagram.trim(),
        twitter: artist.twitter.trim(),
        spotify: artist.spotify.trim(),
        soundcloud: artist.soundcloud.trim(),
        featured: artist.featured,
        order_index: artist.order_index
      };

      if (artist.id) {
        const { error } = await supabase.from('artists').update(artistData).eq('id', artist.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('artists').insert([artistData]);
        if (error) throw error;
      }
      setEditingArtist(null);
      setFormErrors({});
      fetchData();
      alert('Artist saved successfully!');
    } catch (error) {
      console.error('Error saving artist:', error);
      const detailedMessage = getDetailedErrorMessage(error);
      alert(`Error: ${detailedMessage}`);
    }
  };

  const deleteArtist = async (id: string) => {
    if (!user) {
      alert('You must be logged in to delete items.');
      return;
    }
    if (confirm('Delete this artist?')) {
      try {
        const { error } = await supabase.from('artists').delete().eq('id', id);
        if (error) throw error;
        fetchData();
      } catch (error) {
        console.error('Error deleting artist:', error);
        alert('Failed to delete artist. Please try again.');
      }
    }
  };

  const saveRelease = async (release: Release) => {
    if (!user) {
      alert('You must be logged in to save changes.');
      return;
    }
    
    // Clear previous errors
    setFormErrors({});
    
    // Validate form
    const validationErrors = validateRelease(release);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      // Show first error in alert
      const firstError = Object.values(validationErrors)[0];
      alert(`Validation Error: ${firstError}`);
      return;
    }
    
    try {
      const releaseData = {
        title: release.title.trim(),
        artist_name: release.artist_name.trim(),
        artist_id: release.artist_id,
        artwork_url: release.artwork_url.trim(),
        year: release.year.trim(),
        color: release.color.trim(),
        spotify_url: release.spotify_url?.trim() || null,
        apple_music_url: release.apple_music_url?.trim() || null,
        soundcloud_url: release.soundcloud_url?.trim() || null,
        featured: release.featured,
        order_index: release.order_index
      };

      if (release.id) {
        const { error } = await supabase.from('releases').update(releaseData).eq('id', release.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('releases').insert([releaseData]);
        if (error) throw error;
      }
      setEditingRelease(null);
      setFormErrors({});
      fetchData();
      alert('Release saved successfully!');
    } catch (error) {
      console.error('Error saving release:', error);
      const detailedMessage = getDetailedErrorMessage(error);
      alert(`Error: ${detailedMessage}`);
    }
  };

  const deleteRelease = async (id: string) => {
    if (!user) {
      alert('You must be logged in to delete items.');
      return;
    }
    if (confirm('Delete this release?')) {
      try {
        const { error } = await supabase.from('releases').delete().eq('id', id);
        if (error) throw error;
        fetchData();
      } catch (error) {
        console.error('Error deleting release:', error);
        alert('Failed to delete release. Please try again.');
      }
    }
  };

  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg font-black">CHECKING PERMISSIONS...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Card className="w-full max-w-md border-8" style={{ borderColor: theme?.border_color }}>
          <CardHeader>
            <CardTitle className="text-4xl font-black text-center">
              {!user ? 'ADMIN LOGIN' : 'ACCESS DENIED'}
            </CardTitle>
            {!user && <p className="text-center text-sm mt-2">Only authorized administrators can access this panel.</p>}
            {user && !isAdmin && <p className="text-center text-sm mt-2">You don't have admin privileges.</p>}
          </CardHeader>
          {!user ? (
            <CardContent className="space-y-4">
              {/* Auth Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setAuthMode('signin')}
                  variant={authMode === 'signin' ? 'default' : 'outline'}
                  className="flex-1 border-4 font-black"
                  style={authMode === 'signin' ? {
                    backgroundColor: theme?.primary_color,
                    borderColor: theme?.border_color
                  } : { borderColor: theme?.border_color }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  SIGN IN
                </Button>
                <Button
                  onClick={() => setAuthMode('signup')}
                  variant={authMode === 'signup' ? 'default' : 'outline'}
                  className="flex-1 border-4 font-black"
                  style={authMode === 'signup' ? {
                    backgroundColor: theme?.primary_color,
                    borderColor: theme?.border_color
                  } : { borderColor: theme?.border_color }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  SIGN UP
                </Button>
              </div>

              {/* Email Auth Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div>
                  <Label className="text-lg font-black">EMAIL</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 border-4 font-bold"
                    placeholder="admin@example.com"
                  />
                </div>
                <div>
                  <Label className="text-lg font-black">PASSWORD</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 border-4 font-bold pr-12"
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 text-lg font-black border-4"
                  style={{
                    backgroundColor: theme?.primary_color,
                    borderColor: theme?.border_color
                  }}
                >
                  {loading ? 'LOADING...' : authMode === 'signup' ? 'CREATE ACCOUNT' : 'SIGN IN'}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" style={{ borderColor: theme?.border_color }} />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 font-black" style={{ color: theme?.border_color }}>Or</span>
                </div>
              </div>

              {/* Google OAuth Button */}
              <Button
                onClick={signInWithGoogle}
                variant="outline"
                className="w-full h-14 text-lg font-black border-4"
                style={{ borderColor: theme?.border_color }}
              >
                Sign in with Google
              </Button>
            </CardContent>
          ) : null}
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
                          onChange={(e) => {
                            setEditingArtist({ ...editingArtist, name: e.target.value });
                            if (formErrors.name) setFormErrors({...formErrors, name: ''});
                          }}
                          className={`border-4 ${formErrors.name ? 'border-red-500 bg-red-50' : ''}`}
                        />
                        {formErrors.name && <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.name}</p>}
                      </div>
                      <div>
                        <Label className="font-black">GENRE</Label>
                        <Input
                          value={editingArtist.genre}
                          onChange={(e) => {
                            setEditingArtist({ ...editingArtist, genre: e.target.value });
                            if (formErrors.genre) setFormErrors({...formErrors, genre: ''});
                          }}
                          className={`border-4 ${formErrors.genre ? 'border-red-500 bg-red-50' : ''}`}
                        />
                        {formErrors.genre && <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.genre}</p>}
                      </div>
                      <div>
                        <Label className="font-black">IMAGE</Label>
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setEditingArtist({ ...editingArtist, image_file: file });
                              }
                            }}
                            className="border-4"
                          />
                          <div className="flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            <span className="text-sm font-bold">OR ENTER URL</span>
                          </div>
                          <Input
                            value={editingArtist.image_url}
                            onChange={(e) => {
                              setEditingArtist({ ...editingArtist, image_url: e.target.value });
                              if (formErrors.image_url) setFormErrors({...formErrors, image_url: ''});
                            }}
                            className={`border-4 ${formErrors.image_url ? 'border-red-500 bg-red-50' : ''}`}
                            placeholder="https://example.com/artist-image.jpg"
                          />
                          {formErrors.image_url && <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.image_url}</p>}
                        </div>
                      </div>
                      <div>
                        <Label className="font-black">COLOR</Label>
                        <Input
                          type="color"
                          value={editingArtist.color}
                          onChange={(e) => {
                            setEditingArtist({ ...editingArtist, color: e.target.value });
                            if (formErrors.color) setFormErrors({...formErrors, color: ''});
                          }}
                          className={`border-4 h-10 ${formErrors.color ? 'border-red-500' : ''}`}
                        />
                        {formErrors.color && <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.color}</p>}
                      </div>
                      <div>
                        <Label className="font-black">INSTAGRAM</Label>
                        <Input
                          value={editingArtist.instagram}
                          onChange={(e) => {
                            setEditingArtist({ ...editingArtist, instagram: e.target.value });
                            if (formErrors.instagram) setFormErrors({...formErrors, instagram: ''});
                          }}
                          className={`border-4 ${formErrors.instagram ? 'border-red-500 bg-red-50' : ''}`}
                          placeholder="@username or https://instagram.com/username"
                        />
                        {formErrors.instagram && <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.instagram}</p>}
                      </div>
                      <div>
                        <Label className="font-black">TWITTER</Label>
                        <Input
                          value={editingArtist.twitter}
                          onChange={(e) => {
                            setEditingArtist({ ...editingArtist, twitter: e.target.value });
                            if (formErrors.twitter) setFormErrors({...formErrors, twitter: ''});
                          }}
                          className={`border-4 ${formErrors.twitter ? 'border-red-500 bg-red-50' : ''}`}
                          placeholder="@username or https://twitter.com/username"
                        />
                        {formErrors.twitter && <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.twitter}</p>}
                      </div>
                      <div>
                        <Label className="font-black">SPOTIFY</Label>
                        <Input
                          value={editingArtist.spotify}
                          onChange={(e) => {
                            setEditingArtist({ ...editingArtist, spotify: e.target.value });
                            if (formErrors.spotify) setFormErrors({...formErrors, spotify: ''});
                          }}
                          className={`border-4 ${formErrors.spotify ? 'border-red-500 bg-red-50' : ''}`}
                          placeholder="https://open.spotify.com/artist/..."
                        />
                        {formErrors.spotify && <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.spotify}</p>}
                      </div>
                      <div>
                        <Label className="font-black">SOUNDCLOUD</Label>
                        <Input
                          value={editingArtist.soundcloud}
                          onChange={(e) => {
                            setEditingArtist({ ...editingArtist, soundcloud: e.target.value });
                            if (formErrors.soundcloud) setFormErrors({...formErrors, soundcloud: ''});
                          }}
                          className={`border-4 ${formErrors.soundcloud ? 'border-red-500 bg-red-50' : ''}`}
                          placeholder="https://soundcloud.com/username"
                        />
                        {formErrors.soundcloud && <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.soundcloud}</p>}
                      </div>
                    </div>
                    <div>
                      <Label className="font-black">BIO</Label>
                      <Textarea
                        value={editingArtist.bio}
                        onChange={(e) => {
                          setEditingArtist({ ...editingArtist, bio: e.target.value });
                          if (formErrors.bio) setFormErrors({...formErrors, bio: ''});
                        }}
                        className={`border-4 min-h-24 ${formErrors.bio ? 'border-red-500 bg-red-50' : ''}`}
                      />
                      {formErrors.bio && <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.bio}</p>}
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
                  title: '', artist_name: '', artist_id: null, artwork_url: '', year: new Date().getFullYear().toString(),
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
                          onChange={(e) => {
                            setEditingRelease({ ...editingRelease, title: e.target.value });
                            if (formErrors.title) setFormErrors({...formErrors, title: ''});
                          }}
                          className={`border-4 ${formErrors.title ? 'border-red-500 bg-red-50' : ''}`}
                        />
                        {formErrors.title && <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.title}</p>}
                      </div>
                      <div>
                        <Label className="font-black">ARTIST</Label>
                        <select
                          value={editingRelease.artist_id || ''}
                          onChange={(e) => {
                            const selectedArtist = artists.find(a => a.id === e.target.value);
                            setEditingRelease({ 
                              ...editingRelease, 
                              artist_id: e.target.value || null,
                              artist_name: selectedArtist?.name || editingRelease.artist_name
                            });
                          }}
                          className="border-4 h-10 w-full px-3 py-2 bg-white font-bold"
                        >
                          <option value="">Select Artist (Optional)</option>
                          {artists.map((artist) => (
                            <option key={artist.id} value={artist.id}>
                              {artist.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="font-black">ARTIST NAME</Label>
                        <Input
                          value={editingRelease.artist_name}
                          onChange={(e) => {
                            setEditingRelease({ ...editingRelease, artist_name: e.target.value });
                            if (formErrors.artist_name) setFormErrors({...formErrors, artist_name: ''});
                          }}
                          className={`border-4 ${formErrors.artist_name ? 'border-red-500 bg-red-50' : ''}`}
                          placeholder="Enter artist name manually if not in list"
                        />
                        {formErrors.artist_name && <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.artist_name}</p>}
                      </div>
                      <div>
                        <Label className="font-black">ARTWORK URL</Label>
                        <Input
                          value={editingRelease.artwork_url}
                          onChange={(e) => {
                            setEditingRelease({ ...editingRelease, artwork_url: e.target.value });
                            if (formErrors.artwork_url) setFormErrors({...formErrors, artwork_url: ''});
                          }}
                          className={`border-4 ${formErrors.artwork_url ? 'border-red-500 bg-red-50' : ''}`}
                          placeholder="https://example.com/album-artwork.jpg"
                        />
                        {formErrors.artwork_url && <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.artwork_url}</p>}
                      </div>
                      <div>
                        <Label className="font-black">YEAR</Label>
                        <Input
                          value={editingRelease.year}
                          onChange={(e) => {
                            setEditingRelease({ ...editingRelease, year: e.target.value });
                            if (formErrors.year) setFormErrors({...formErrors, year: ''});
                          }}
                          className={`border-4 ${formErrors.year ? 'border-red-500 bg-red-50' : ''}`}
                        />
                        {formErrors.year && <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.year}</p>}
                      </div>
                      <div>
                        <Label className="font-black">COLOR</Label>
                        <Input
                          type="color"
                          value={editingRelease.color}
                          onChange={(e) => {
                            setEditingRelease({ ...editingRelease, color: e.target.value });
                            if (formErrors.color) setFormErrors({...formErrors, color: ''});
                          }}
                          className={`border-4 h-10 ${formErrors.color ? 'border-red-500' : ''}`}
                        />
                        {formErrors.color && <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.color}</p>}
                      </div>
                      <div>
                        <Label className="font-black">SPOTIFY URL</Label>
                        <Input
                          value={editingRelease.spotify_url}
                          onChange={(e) => {
                            setEditingRelease({ ...editingRelease, spotify_url: e.target.value });
                            if (formErrors.spotify_url) setFormErrors({...formErrors, spotify_url: ''});
                          }}
                          className={`border-4 ${formErrors.spotify_url ? 'border-red-500 bg-red-50' : ''}`}
                          placeholder="https://open.spotify.com/album/..."
                        />
                        {formErrors.spotify_url && <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.spotify_url}</p>}
                      </div>
                      <div>
                        <Label className="font-black">APPLE MUSIC URL</Label>
                        <Input
                          value={editingRelease.apple_music_url}
                          onChange={(e) => {
                            setEditingRelease({ ...editingRelease, apple_music_url: e.target.value });
                            if (formErrors.apple_music_url) setFormErrors({...formErrors, apple_music_url: ''});
                          }}
                          className={`border-4 ${formErrors.apple_music_url ? 'border-red-500 bg-red-50' : ''}`}
                          placeholder="https://music.apple.com/album/..."
                        />
                        {formErrors.apple_music_url && <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.apple_music_url}</p>}
                      </div>
                      <div>
                        <Label className="font-black">SOUNDCLOUD URL</Label>
                        <Input
                          value={editingRelease.soundcloud_url}
                          onChange={(e) => {
                            setEditingRelease({ ...editingRelease, soundcloud_url: e.target.value });
                            if (formErrors.soundcloud_url) setFormErrors({...formErrors, soundcloud_url: ''});
                          }}
                          className={`border-4 ${formErrors.soundcloud_url ? 'border-red-500 bg-red-50' : ''}`}
                          placeholder="https://soundcloud.com/username/album-name"
                        />
                        {formErrors.soundcloud_url && <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.soundcloud_url}</p>}
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