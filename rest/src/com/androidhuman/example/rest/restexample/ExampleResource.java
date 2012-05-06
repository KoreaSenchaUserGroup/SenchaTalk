package com.androidhuman.example.rest.restexample;

import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

@Path("/senchatalk")
public class ExampleResource {
	
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/hello")
	public String getHelloMessage(){
		return "Hello, REST!";
	}
	
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/account/userNum={id}&userName={name}")
	public String printParamValues(@PathParam("id")final int userNum, @PathParam("name")final String userName) {
		return "User number : " + userNum + " name : " + userName;
	}
	
	private List<NameValuePair> convertParam(Map params){
        List<NameValuePair> paramList = new ArrayList<NameValuePair>();
        Iterator<String> keys = params.keySet().iterator();
        while(keys.hasNext()){
            String key = keys.next();
            paramList.add(new BasicNameValuePair(key, params.get(key).toString()));
        }
         
        return paramList;
    }
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/getuserinfo/id={id}")
	public String getUserInfo(@PathParam("id")final String id) {
		HttpClient client = new DefaultHttpClient();
		Map params = new HashMap();
		Map<String, String> userInfo = new HashMap<String, String>();
		String jsonResult = "";

		String url = "https://api.twitter.com/1/users/lookup.json";
		
		params.put("screen_name", id);
		params.put("include_entities", "true");
		
		try {
			List<NameValuePair> paramList = convertParam(params); 
			HttpGet get = new HttpGet(url+"?"+URLEncodedUtils.format(paramList, "UTF-8"));
			
			ResponseHandler<String> rh = new BasicResponseHandler();
			jsonResult = client.execute(get, rh);
			
			
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			client.getConnectionManager().shutdown();
		}
		
		return jsonResult;
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/getalluserlist")
	public String getAllUserList() throws JsonGenerationException, JsonMappingException, IOException {
		Map<String, String> dummyData = new HashMap<String, String>();
	    dummyData.put("value1", "값1");
	    dummyData.put("value2", "값2");
	    dummyData.put("value3", "값3");
	    dummyData.put("value4", "값4");
	     
	    StringWriter sw = new StringWriter();
	     
	    // Jackson JSON Mapper 를 사용해서 Map 을 JSON 문자열로 변환
	    ObjectMapper mapper = new ObjectMapper();
	    mapper.writeValue(sw, dummyData);
	     
		return null;
	}

}
