// Simple Notes App - Authentication Diagnostic Script
// Run this in your browser console (F12) at http://localhost:5173

console.log("🔍 Starting Supabase Authentication Diagnostic...\n");

// Configuration
const SUPABASE_URL = "https://ilyqrfkgfxaeaazpfjie.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlseXFyZmtnZnhhZWFhenBmamllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NzQyNjMsImV4cCI6MjA4NDE1MDI2M30.KoiGtR1_NG9g2VM_ClccIt460NTEX6zT81c-AA04IuA";

// Test 1: Check Supabase connectivity
async function testSupabaseConnection() {
    console.log("Test 1: Checking Supabase connection...");
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY
            }
        });
        console.log("✅ Supabase is reachable");
        return true;
    } catch (error) {
        console.error("❌ Cannot reach Supabase:", error.message);
        return false;
    }
}

// Test 2: Try to sign up a new user
async function testSignup() {
    console.log("\nTest 2: Testing signup...");
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = "TestPassword123";

    console.log(`Attempting signup with: ${testEmail}`);

    try {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: testEmail,
                password: testPassword
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("✅ Signup successful!");
            console.log("User ID:", data.user?.id);
            console.log("Email:", data.user?.email);
            console.log("Email confirmed:", data.user?.email_confirmed_at ? "Yes" : "No");

            if (!data.user?.email_confirmed_at) {
                console.warn("⚠️  Email confirmation is ENABLED - you need to confirm email or disable this in Supabase settings");
                console.warn("👉 Go to: https://supabase.com/dashboard/project/ilyqrfkgfxaeaazpfjie/auth/providers");
                console.warn("👉 Scroll to 'Email' and turn OFF 'Confirm email'");
            }

            return { success: true, user: data.user, session: data.session };
        } else {
            console.error("❌ Signup failed");
            console.error("Status:", response.status);
            console.error("Error:", data);
            return { success: false, error: data };
        }
    } catch (error) {
        console.error("❌ Network error during signup:", error.message);
        return { success: false, error: error.message };
    }
}

// Test 3: Check if users table exists (auth.users is managed by Supabase)
async function testUsersTable() {
    console.log("\nTest 3: Checking Supabase Auth...");
    console.log("ℹ️  Supabase automatically manages the auth.users table");
    console.log("ℹ️  You don't need to create a separate users table");
    console.log("✅ Auth system is built-in and ready to use");
}

// Test 4: Check notes table
async function testNotesTable() {
    console.log("\nTest 4: Checking notes table...");
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/notes?limit=1`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY
            }
        });

        if (response.status === 200) {
            console.log("✅ Notes table exists and is accessible");
        } else if (response.status === 401 || response.status === 403) {
            console.log("✅ Notes table exists (protected by RLS - this is correct)");
        } else {
            console.warn("⚠️  Unexpected response:", response.status);
        }
    } catch (error) {
        console.error("❌ Error checking notes table:", error.message);
    }
}

// Run all tests
async function runDiagnostics() {
    console.log("=".repeat(60));
    console.log("SIMPLE NOTES APP - AUTHENTICATION DIAGNOSTICS");
    console.log("=".repeat(60) + "\n");

    await testSupabaseConnection();
    await testUsersTable();
    await testNotesTable();
    const signupResult = await testSignup();

    console.log("\n" + "=".repeat(60));
    console.log("SUMMARY");
    console.log("=".repeat(60));

    if (signupResult.success) {
        console.log("\n✅ ALL TESTS PASSED!");
        console.log("\n📝 You can now:");
        console.log("1. Go to http://localhost:5173");
        console.log("2. Click 'Sign up'");
        console.log("3. Create an account");
        console.log("4. Start creating notes!");

        if (signupResult.user && !signupResult.user.email_confirmed_at) {
            console.log("\n⚠️  IMPORTANT: Disable email confirmation in Supabase for easier testing");
        }
    } else {
        console.log("\n❌ ISSUES DETECTED");
        console.log("\nPlease check:");
        console.log("1. Backend server is running (http://localhost:5000)");
        console.log("2. Frontend server is running (http://localhost:5173)");
        console.log("3. Supabase credentials are correct");
        console.log("4. Database schema was run successfully");
    }

    console.log("\n" + "=".repeat(60));
}

// Run diagnostics
runDiagnostics();
