"use client";

import { useEffect } from "react";

export default function Page() {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllPosts = async () => {
      setLoading(true);

      const response = await fetch("/api/posts");

      if (!response.ok) {
        setPosts([]);
        setError("Erro ao buscar posts");
        setLoading(false);
        return;
      }

      const { data } = await response.json();
      setPosts(data);
      setError(null);
      setLoading(false);
    };

    fetchAllPosts();
  }, []);

  const handleBlur = async () => {
    if (!search.trim()) return;

    setLoading(true);

    const response = await fetch(`/api/posts?search=${search}`);

    if (!response.ok) {
      setPosts([]);
      setError("Erro ao buscar posts");
      setLoading(false);
      return;
    }

    const { data } = await response.json();
    setPosts(data);
    setError(null);
    setLoading(false);
  };

  return (
    <div>
      <input
        type="search"
        name="search"
        id="searchbar"
        placeholder="Pesquisar"
      />
    </div>
  );
}
