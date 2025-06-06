export async function logout() {
    // const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    // await fetch(`${API_BASE_URL}/auth/logout`, {
    //     method: 'POST',
    //     credentials: 'include', // This makes sure cookies are sent and cleared
    // });
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

}
