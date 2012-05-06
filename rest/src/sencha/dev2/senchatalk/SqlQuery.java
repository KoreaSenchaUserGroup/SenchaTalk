package sencha.dev2.senchatalk;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class SqlQuery {
	
	public SqlQuery() {
		super();
	}
	
	public boolean setTwitterUser(String screenName, String pictureUrl) {
		SqlConn sqlConn = new SqlConn();
		Connection conn			= null;
		PreparedStatement psmt	= null;
		boolean setResult = false;
		
		String sql = "INSERT INTO user (screen_name, pic_url)"
				+" VALUES (?, ?)"; 
//				+" ON DUPLICATE KEY UPDATE"
//				+" email=?, item_code=?, remaining=remaining+?";

		try {
			conn = sqlConn.getConnection();
			psmt = conn.prepareStatement(sql);

			psmt.setString(1, screenName);
			psmt.setString(2, pictureUrl);

			psmt.executeUpdate();

			setResult = true;
		} catch (SQLException e) {
			e.printStackTrace();
			setResult = false;
		} finally{
			sqlConn.closes(conn, psmt);
		}
		
		
		return setResult;
	}
}
