import {useEffect} from 'react';
import {useHistory} from '@docusaurus/router';

export default function Home() {
  const history = useHistory();
  
  useEffect(() => {
    // Redirect to the introduction page
    history.replace('/docs/intro');
  }, [history]);

  // Return null since we're redirecting
  return null;
}
