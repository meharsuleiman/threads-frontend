import { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
import UserPost from '../components/UserPost';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { Flex, Spinner } from '@chakra-ui/react';

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();

        if (data.error) {
          showToast('Error', data.error, 'error');
          return;
        }
        setUser(data);
      } catch (error) {
        showToast('Error', error, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [username, showToast]);

  if (!user && loading) {
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={'xl'} />
      </Flex>
    );
  }

  if (!user && !loading) {
    return <h1>User not found</h1>;
  }

  return (
    <>
      <UserHeader user={user} />
      <UserPost
        likes={1200}
        replies={481}
        postImg='/post1.png'
        postTitle="Let's talk about threads."
      />
      <UserPost
        likes={2900}
        replies={251}
        postImg='/post2.png'
        postTitle='Why do you need to learn React?'
      />
      <UserPost
        likes={1200}
        replies={481}
        postImg='/post3.png'
        postTitle='Are you a good developer?'
      />
      <UserPost
        likes={1200}
        replies={481}
        // postImg='/post4.png'
        postTitle='This is my first post! 🎉'
      />
    </>
  );
};

export default UserPage;
