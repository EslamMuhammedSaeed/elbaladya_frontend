# Global Search Implementation

This document describes the implementation of the global search functionality in the Albladya application.

## Overview

The global search feature allows users to search across multiple data models (students, courses, groups, and admins) from a single search input in the navigation bar. When a user types a search query, the system searches across all models and displays results in a dropdown with navigation capabilities.

## Features

- **Real-time search**: Search as you type (minimum 2 characters)
- **Multi-model search**: Searches across students, courses, groups, and admins
- **Smart navigation**: Click on any result to navigate to the appropriate page
- **Keyboard navigation**: Use Enter to navigate to the first result, Escape to close dropdown
- **Responsive design**: Works on both desktop and mobile devices
- **Internationalization**: Supports both English and Arabic languages
- **Dark mode support**: Automatically adapts to the current theme

## Backend Requirements

The backend must implement a GraphQL query with the following structure:

```graphql
type SearchModel {
  students: [Student!]!
  courses: [Course!]!
  groups: [Group!]!
  admins: [Admin!]!
}

type Query {
  searchModel(search: String!): SearchModel @auth
}
```

### Expected Data Structure

- **Students**: `id`, `name`, `facultyId`
- **Courses**: `id`, `arabicName`, `englishName`
- **Groups**: `id`, `name`
- **Admins**: `id`, `name`

## Frontend Implementation

### Components

1. **GlobalSearchInput** (`src/components/SearchInput/GlobalSearchInput.tsx`)

   - Main search component with dropdown functionality
   - Handles search queries and displays results
   - Manages navigation to result pages

2. **Search Types** (`src/utils/searchTypes.ts`)

   - TypeScript interfaces for search results
   - Ensures type safety across the search functionality

3. **GraphQL Query** (`src/quiries/search/globalSearch.ts`)
   - Apollo GraphQL query for the search endpoint

### Styling

- **GlobalSearchInput.module.scss**: Comprehensive styling with dark mode support
- Uses CSS custom properties for theming
- Responsive design with proper hover states and animations

### Navigation Routes

The search results navigate to the following routes:

- **Students**: `/trainees/{id}` - Individual trainee details page
- **Courses**: `/trainings` - Trainings page (courses are displayed there)
- **Groups**: `/groups` - Groups management page
- **Admins**: `/admins` - Admins management page

## Usage

### For Users

1. **Type in the search bar**: Located in the top navigation bar
2. **View results**: Results appear in a dropdown below the search input
3. **Navigate**: Click on any result to go to the corresponding page
4. **Keyboard shortcuts**:
   - `Enter`: Navigate to first result
   - `Escape`: Close dropdown
   - `Tab`: Navigate through results

### For Developers

#### Adding New Search Models

1. **Update GraphQL schema**: Add new fields to `SearchModel` type
2. **Update search types**: Add new interfaces in `searchTypes.ts`
3. **Update search query**: Modify `globalSearch.ts` to include new fields
4. **Update component logic**: Modify `GlobalSearchInput.tsx` to handle new result types
5. **Add translations**: Add new labels in both `en.json` and `ar.json`

#### Customizing Search Behavior

- **Minimum search length**: Currently set to 2 characters (modify in `handleInputChange`)
- **Debouncing**: Can be added to reduce API calls during typing
- **Result limits**: Can be implemented on the backend or frontend
- **Search filters**: Can add dropdown filters for specific model types

## Internationalization

The search functionality supports both English and Arabic:

- **English**: `src/locales/en.json`
- **Arabic**: `src/locales/ar.json`

### Translation Keys

```json
{
  "search": {
    "student": "Student",
    "course": "Course",
    "group": "Group",
    "admin": "Admin",
    "results": "Search Results",
    "searching": "Searching...",
    "error": "Search error occurred",
    "noResults": "No results found"
  },
  "navbar": {
    "search": "Search..."
  }
}
```

## Performance Considerations

- **Lazy loading**: Uses Apollo's `useLazyQuery` for on-demand API calls
- **Debouncing**: Can be implemented to reduce API calls during rapid typing
- **Result caching**: Apollo Client provides automatic caching of search results
- **Pagination**: For large result sets, consider implementing pagination

## Error Handling

The component handles various error states:

- **Loading state**: Shows spinner while searching
- **Error state**: Displays error message if search fails
- **No results**: Shows appropriate message when no matches found
- **Network issues**: Gracefully handles network failures

## Testing

To test the global search functionality:

1. **Start the application**: `npm run dev`
2. **Navigate to any page**: The search bar is available in the top navigation
3. **Type a search query**: Enter at least 2 characters
4. **Verify results**: Check that results appear in the dropdown
5. **Test navigation**: Click on results to ensure proper routing
6. **Test keyboard navigation**: Use Enter and Escape keys
7. **Test responsiveness**: Resize browser window to test mobile behavior

## Future Enhancements

- **Search history**: Remember recent searches
- **Advanced filters**: Filter by model type, date ranges, etc.
- **Search suggestions**: Auto-complete and search suggestions
- **Search analytics**: Track popular search terms
- **Voice search**: Voice input support
- **Search within results**: Refine search results further
