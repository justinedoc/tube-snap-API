const fetchProgress = async function (id) {
  try {
    const res = await fetch(
      `https://p.oceansaver.in/ajax/progress.php?id=${id}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default fetchProgress;
