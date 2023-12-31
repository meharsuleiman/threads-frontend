import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
} from '@chakra-ui/react';
import { BsInstagram } from 'react-icons/bs';
import { CgMoreO } from 'react-icons/cg';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import useShowToast from '../hooks/useShowToast';

const UserHeader = ({ user }) => {
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );
  const [updating, setUpdating] = useState(false);

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast('Error', 'You must be logged in to follow users.', 'error');
      return;
    }
    if (updating) return;
    try {
      setUpdating(true);
      const res = await fetch(
        `https://threads-backend-zeta.vercel.app/api/users/follow/${user._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      const data = await res.json();

      if (data.error) {
        showToast('Error', data.error, 'error');
        return;
      }
      if (following) {
        showToast('Unfollowed', `Unfollowed ${user.name}`, 'success');
        user.followers.pop();
      } else {
        showToast('Followed', `Followed ${user.name}`, 'success');
        user.followers.push(currentUser?._id);
      }
      setFollowing(!following);
    } catch (error) {
      showToast('Error', error, 'error');
    } finally {
      setUpdating(false);
    }
  };

  const copyURL = async () => {
    await navigator.clipboard.writeText(window.location.href);
    showToast('Copied.', 'Profile link copied to clipboard.', 'success');
  };
  return (
    <VStack gap='4' alignItems='start'>
      <Flex justifyContent='space-between' w='full'>
        <Box>
          <Text fontSize='2xl' fontWeight='bold'>
            {user.name}
          </Text>
          <Flex gap='2' alignItems='center'>
            <Text fontSize='sm'>{user.username}</Text>
            <Text
              fontSize='xs'
              bg='gray.dark'
              color='gray.light'
              p='1'
              borderRadius='full'
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            name={user.name}
            src={user.profilePic}
            size={{
              base: 'lg',
              md: 'xl',
            }}
          />
        </Box>
      </Flex>

      <Text>{user.bio}</Text>

      {user._id === currentUser?._id && (
        <Link as={RouterLink} to={'/update'}>
          <Button size={'sm'}>Edit profile</Button>
        </Link>
      )}

      {user._id !== currentUser?._id && (
        <Link as={RouterLink}>
          <Button
            size={'sm'}
            onClick={handleFollowUnfollow}
            isLoading={updating}
          >
            {following ? 'Unfolow' : 'Follow'}
          </Button>
        </Link>
      )}

      <Flex w='full' justifyContent='space-between'>
        <Flex gap='2' alignItems='center'>
          <Text color='gray.light'>{user.followers.length} followers</Text>
          <Box w='1' h='1' bg='gray.light' borderRadius='full'></Box>
          <Link color='gray.light'>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className='icon-container'>
            <BsInstagram size='24' cursor='pointer' />
          </Box>
          <Box className='icon-container'>
            <Menu>
              <MenuButton>
                <CgMoreO size='24' cursor='pointer' />
              </MenuButton>
              <Portal>
                <MenuList bg='gray-dark'>
                  <MenuItem bg='gray-dark' onClick={copyURL}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w='full'>
        <Flex
          flex='1'
          borderBottom='1.5px solid white'
          justifyContent='center'
          pb='3'
          cursor='pointer'
        >
          <Text fontWeight='bold'>Threads</Text>
        </Flex>
        <Flex
          flex='1'
          borderBottom='1px solid gray'
          justifyContent='center'
          pb='3'
          cursor='pointer'
          color='gray.light'
        >
          <Text fontWeight='bold'>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
