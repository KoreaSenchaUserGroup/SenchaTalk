package sencha.dev2.senchatalk;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class SqlConn {
	private String dbURL = "jdbc:mysql://127.0.0.1:3306/senchatalk";
	private String id = "root";
	private String passwd = "root1234";

	public SqlConn() {
		init();
	}
	
	/*
	 * 데이터베이스 드라이버 로딩
	 */
	private void init() {
		try {
			Class.forName("com.mysql.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			System.err.println("Class.forName에서 에러");
			e.printStackTrace();
			System.err.println("Class.forName에서 에러");
		}
		
	} // end init
	
	/*
	 * 데이터베이스와 연결
	 */
	public Connection getConnection() throws SQLException {
		
		Connection conn = null;
		String url 		= dbURL;
		String user 	= id;
		String password	= passwd;
		
		try {
			conn = DriverManager.getConnection(url, user, password);
		} catch (SQLException e) {
			e.printStackTrace();
			System.err.println("getConnection에서 에러");
		}
		return conn;
		
	} // end getConnection
	
	public void closes(Connection conn, Statement psmt) {
		if(psmt!=null){
			try {
				psmt.close();
			} catch (SQLException e) {
			}
		}
		if(conn!=null){
			try {
				conn.close();
			} catch (SQLException e) {
			}
		}
	}
	
	/*
	 * 데이터베이스와 연결 종료
	 */
	public void close(Connection conn, Statement psmt, ResultSet rs){
		if(rs!=null){
			try {
				rs.close();
			} catch (SQLException e) {
			}
		}
		if(psmt!=null){
			try {
				psmt.close();
			} catch (SQLException e) {
			}
		}
		if(conn!=null){
			try {
				conn.close();
			} catch (SQLException e) {
			}
		}
	} // end close
}
