import request from 'superagent'

const fetchData = async () => {
	const url = `https://serene-earth-69573.herokuapp.com/api/metrics`
	try{
		const response = await request.get(url)
		return response.body
	}catch(error){
		console.log('Error: ', error)
		return []
	}
}

export default fetchData