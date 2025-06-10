# The Coil Collective

A web application for discovering and connecting with curly hair salons in your area.

## Features

- Browse and search for curly hair salons
- Submit new salons to the directory
- Claim and manage your salon listing
- Admin dashboard for managing submissions and claims
- Waitlist for early access

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Database & Authentication)
- shadcn/ui (UI Components)

## Getting Started

### Prerequisites

- Node.js 16+
- npm or pnpm
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/the-coil-collective.git
   cd the-coil-collective
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following Supabase tables:

- `salons`: Main directory of salons
- `waitlist_emails`: Email collection for waitlist
- `submitted_salons`: Pending salon submissions
- `claim_requests`: Salon ownership claims

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
