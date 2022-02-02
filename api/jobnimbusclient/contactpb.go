package jobnimbusclient

import (
	"net/http"

	"google.golang.org/protobuf/types/known/timestamppb"
)

func PlaceHolderHandler(w http.ResponseWriter, r *http.Request) {}

// Response for listContactRequests
type ListContactsResponse struct {

	// The contacts from the specified publisher.
	Contacts []*Contact `protobuf:"bytes,1,rep,name=contacts,proto3" json:"contacts,omitempty"`
	// A token, which can be sent as `page_token` to retrieve the next page.
	// If this field is omitted, there are no subsequent pages.
	NextPageToken string `protobuf:"bytes,2,opt,name=next_page_token,json=nextPageToken,proto3" json:"next_page_token,omitempty"`
}

// A representation of an Contact in the jobnimbus/public
type Contact struct {

	// name ID of the APP ;-)
	Name string `protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`
	// The system ID of the resource
	Uid string `protobuf:"bytes,2,opt,name=uid,proto3" json:"uid,omitempty"`
	// display name (user set name) https://aip.kolla.dev/148
	DisplayName string `protobuf:"bytes,3,opt,name=display_name,json=displayName,proto3" json:"display_name,omitempty"`
	// record_type
	RecordType int64 `protobuf:"varint,4,opt,name=record_type,json=recordType,proto3" json:"record_type,omitempty"`
	// status
	Status int64 `protobuf:"varint,5,opt,name=status,proto3" json:"status,omitempty"`
	// given name
	GivenName string `protobuf:"bytes,10,opt,name=given_name,json=givenName,proto3" json:"given_name,omitempty"`
	// family name
	FamilyName string `protobuf:"bytes,11,opt,name=family_name,json=familyName,proto3" json:"family_name,omitempty"`
	// company
	Company string `protobuf:"bytes,12,opt,name=company,proto3" json:"company,omitempty"`
	// address line 1
	Address string `protobuf:"bytes,13,opt,name=address,proto3" json:"address,omitempty"`
	// address line 2
	Address_2 string `protobuf:"bytes,14,opt,name=address_2,json=address2,proto3" json:"address_2,omitempty"`
	// city
	City string `protobuf:"bytes,15,opt,name=city,proto3" json:"city,omitempty"`
	// state
	State string `protobuf:"bytes,16,opt,name=state,proto3" json:"state,omitempty"`
	// postcode
	Postcode string `protobuf:"bytes,17,opt,name=postcode,proto3" json:"postcode,omitempty"`
	// created_by
	CreatedBy string `protobuf:"bytes,6,opt,name=created_by,json=createdBy,proto3" json:"created_by,omitempty"`
	// sales_rep
	SalesRep string `protobuf:"bytes,7,opt,name=sales_rep,json=salesRep,proto3" json:"sales_rep,omitempty"`
	// jnid
	Jnid string `protobuf:"bytes,8,opt,name=jnid,proto3" json:"jnid,omitempty"`
	// Timestamps. See: https://aip.kolla.dev/kolla/9001
	// create time
	CreateTime *timestamppb.Timestamp `protobuf:"bytes,90,opt,name=create_time,json=createTime,proto3" json:"create_time,omitempty"`
	// time of last update
	UpdateTime *timestamppb.Timestamp `protobuf:"bytes,91,opt,name=update_time,json=updateTime,proto3" json:"update_time,omitempty"`
	// delete time (for soft deleting)
	DeleteTime *timestamppb.Timestamp `protobuf:"bytes,92,opt,name=delete_time,json=deleteTime,proto3" json:"delete_time,omitempty"`
	// expire time says when to do the hard delete after the soft delete
	ExpireTime *timestamppb.Timestamp `protobuf:"bytes,93,opt,name=expire_time,json=expireTime,proto3" json:"expire_time,omitempty"`
}
