import { useAuth } from '@/authMiddleware';
import { cookies } from 'next/headers';

const Home = async () => {
  const user = cookies().get('user')
  await useAuth();

  const greetings = [
    'Hello',
    'Hi',
    'Hey',
    'Howdy',
    'Hola',
    'Namaste',
    'Salaam',
    'Shalom',
    'What\'s up',
    'How\'s your day',
    'How\'s your day going',
  ]
  
  return (
    <div className="h-full md:grid md:grid-cols-12 flex flex-col gap-3">
      <div className="col-span-4">
        siema
      </div>
    </div>
  )
}



export default Home;
