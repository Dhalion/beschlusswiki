import server, {port} from "app";

// Start server
server.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
