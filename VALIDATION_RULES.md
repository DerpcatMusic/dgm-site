# Admin Panel Validation Rules & Character Restrictions

## Security Summary
✅ **Admin Access Control**: Only users with emails in the `admin_users` table can access admin functionality
✅ **Row Level Security**: RLS policies restrict database operations to authenticated admin users
✅ **Authentication**: Secure login with email/password and Google OAuth
✅ **Error Handling**: Field-specific validation with visual error indicators

## Character Restrictions & Validation Rules

### Artist Form Validation

#### **Name** (Required)
- **Allowed Characters**: Letters (a-z, A-Z), numbers (0-9), spaces, hyphens (-), underscores (_), periods (.), apostrophes ('), ampersands (&)
- **Max Length**: 100 characters
- **Error**: "Artist name can only contain letters, numbers, spaces, and basic punctuation"

#### **Genre** (Optional)
- **Allowed Characters**: Same as name field
- **Max Length**: 50 characters
- **Error**: "Genre must be 50 characters or less and contain only letters, numbers, spaces, and basic punctuation"

#### **Image URL** (Optional)
- **Format**: Must be valid HTTP/HTTPS URL
- **File Types**: .jpg, .jpeg, .png, .gif, .webp, .svg
- **Error**: "Image URL must be a valid image URL (jpg, jpeg, png, gif, webp, svg)"

#### **Color** (Optional)
- **Format**: Hex color code (e.g., #FF0000)
- **Error**: "Color must be a valid hex color (e.g., #FF0000)"

#### **Bio** (Optional)
- **Max Length**: 1000 characters
- **Error**: "Bio must be 1000 characters or less"

#### **Social Media URLs** (Optional)
- **Spotify**: Must contain "spotify.com"
- **Instagram**: Must contain "instagram.com" OR start with "@"
- **Twitter**: Must contain "twitter.com" OR start with "@"
- **SoundCloud**: Must contain "soundcloud.com"

### Release Form Validation

#### **Title** (Required)
- **Allowed Characters**: Letters, numbers, spaces, hyphens (-), underscores (_), periods (.), exclamation marks (!), parentheses (), ampersands (&), apostrophes ('), quotes (")
- **Max Length**: 200 characters
- **Error**: "Title can only contain letters, numbers, spaces, and basic punctuation"

#### **Artist Name** (Required)
- **Same rules as Artist Name field above**

#### **Artwork URL** (Optional)
- **Same rules as Artist Image URL field above**

#### **Year** (Required)
- **Range**: 1900 to current year + 5
- **Format**: Must be a valid 4-digit year
- **Error**: "Year must be between 1900 and [current year + 5]"

#### **Color** (Required)
- **Same rules as Artist Color field above**

#### **Music Platform URLs** (Optional)
- **Spotify**: Must contain "spotify.com"
- **Apple Music**: Must contain "music.apple.com"
- **SoundCloud**: Must contain "soundcloud.com"

## Error Display Features

### Visual Error Indicators
- **Red Border**: Fields with validation errors show red borders
- **Red Background**: Input fields with errors have light red background
- **Error Messages**: Specific error messages appear below each field
- **Real-time Validation**: Errors clear as you type correct values

### Error Messages
- **Field-specific**: Each field shows its own validation error
- **Character-specific**: Messages specify what characters are allowed
- **Format-specific**: Messages explain required formats (URLs, colors, etc.)
- **Length-specific**: Messages show maximum character limits

## Testing Recommendations

### To Test Validation:
1. **Try invalid characters**: Use special characters like @#$%^&*() in name fields
2. **Test length limits**: Enter very long text in name/title fields
3. **Invalid URLs**: Enter non-music platform URLs in music URL fields
4. **Invalid formats**: Try wrong color formats or invalid years
5. **Empty required fields**: Leave required fields blank

### Security Testing:
1. **Non-admin access**: Try accessing admin panel without admin email
2. **Database operations**: Verify RLS policies prevent unauthorized access
3. **Form submissions**: Test with malicious input to ensure validation works

## Recent Improvements Made

✅ Added field-specific validation with clear error messages
✅ Added visual error indicators (red borders, error text)
✅ Implemented character restrictions for all text fields
✅ Added URL format validation for music platforms
✅ Enhanced error handling with detailed feedback
✅ Added real-time error clearing when users fix issues
✅ Implemented comprehensive validation for both artists and releases

All validation rules are now active and will prevent invalid data from being submitted while providing clear feedback about what characters and formats are allowed.